import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";

const root = process.cwd();
const baseUrl = process.env.MOBILE_AUDIT_URL ?? "http://127.0.0.1:3000";
const outputDir = path.join(root, ".mobile-audit");
const browserPath = process.env.MOBILE_AUDIT_BROWSER ??
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const quick = process.argv.includes("--quick");
const captureScreenshots = !process.argv.includes("--no-screenshots");
const widths = [320, 360, 375, 390, 412, 430];

const coreRoutes = [
  "/",
  "/services",
  "/services/signature-manicure",
  "/book/service",
  "/book/add-ons",
  "/book/technician",
  "/book/date-time",
  "/book/details",
  "/team",
  "/gallery",
  "/pricing",
  "/membership",
  "/gift-cards",
  "/shop",
  "/shop/cuticle-elixir",
  "/cart",
  "/checkout",
  "/auth/login",
  "/auth/register",
  "/account",
  "/account/appointments",
  "/account/profile",
  "/contact",
  "/faq",
  "/blog",
  "/blog/quiet-luxury-nails",
  "/admin",
  "/admin/appointments",
];

const routes = quick
  ? ["/", "/services", "/book/details", "/gallery", "/shop", "/cart", "/checkout", "/account", "/admin"]
  : coreRoutes;

const screenshotRoutes = new Set([
  "/",
  "/services",
  "/book/details",
  "/gallery",
  "/shop",
  "/checkout",
  "/account",
  "/admin",
]);

class CdpClient {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.sequence = 0;
    this.pending = new Map();
    this.ready = new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    });
    this.socket.addEventListener("close", () => {
      for (const pending of this.pending.values()) pending.reject(new Error("The browser DevTools connection closed."));
      this.pending.clear();
    });
  }

  async send(method, params = {}) {
    await this.ready;
    const id = ++this.sequence;
    const result = new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
    this.socket.send(JSON.stringify({ id, method, params }));
    return result;
  }

  close() {
    this.socket.close();
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForBrowser(port) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {}
    await wait(100);
  }
  throw new Error("The headless browser did not expose a DevTools endpoint.");
}

async function waitForPage(client) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const state = await client.send("Runtime.evaluate", {
      expression: "document.readyState",
      returnByValue: true,
    });
    if (state.result.value === "complete") {
      await wait(350);
      return;
    }
    await wait(100);
  }
  throw new Error("Page load timed out.");
}

function routeName(route) {
  return route === "/" ? "home" : route.slice(1).replaceAll("/", "--");
}

const auditExpression = String.raw`(() => {
  const viewportWidth = window.innerWidth;
  const visible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  };
  const selector = (element) => {
    const pieces = [];
    let current = element;
    while (current && current !== document.body && pieces.length < 4) {
      let piece = current.tagName.toLowerCase();
      if (current.id) piece += "#" + current.id;
      else if (current.classList.length) piece += "." + [...current.classList].slice(0, 2).join(".");
      pieces.unshift(piece);
      current = current.parentElement;
    }
    return pieces.join(" > ");
  };
  const insideHorizontalScroller = (element) => {
    let current = element.parentElement;
    while (current && current !== document.body) {
      const style = getComputedStyle(current);
      if (["auto", "scroll"].includes(style.overflowX) && current.scrollWidth > current.clientWidth + 1) return true;
      current = current.parentElement;
    }
    return false;
  };

  const overflow = [...document.querySelectorAll("body *")]
    .filter(visible)
    .map((element) => ({ element, rect: element.getBoundingClientRect() }))
    .filter(({ element, rect }) =>
      (rect.right > viewportWidth + 1 || rect.left < -1) && !insideHorizontalScroller(element)
    )
    .slice(0, 30)
    .map(({ element, rect }) => ({
      selector: selector(element),
      left: Math.round(rect.left * 10) / 10,
      right: Math.round(rect.right * 10) / 10,
      width: Math.round(rect.width * 10) / 10,
      text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
    }));

  const undersizedControls = [...document.querySelectorAll("button, input:not([type=hidden]):not([type=checkbox]):not([type=radio]), select, textarea, summary")]
    .filter(visible)
    .map((element) => ({ element, rect: element.getBoundingClientRect() }))
    .filter(({ rect }) => rect.width < 44 || rect.height < 44)
    .slice(0, 40)
    .map(({ element, rect }) => ({
      selector: selector(element),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      text: (element.getAttribute("aria-label") || element.textContent || element.getAttribute("placeholder") || "")
        .trim().replace(/\s+/g, " ").slice(0, 70),
    }));

  const brokenImages = [...document.images]
    .filter((image) => image.complete && image.naturalWidth === 0)
    .map((image) => image.currentSrc || image.src);

  return {
    title: document.title,
    url: location.pathname + location.search,
    viewport: {
      innerWidth: window.innerWidth,
      clientWidth: document.documentElement.clientWidth,
      visualWidth: window.visualViewport?.width ?? null,
    },
    documentWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    hasHorizontalScroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > document.documentElement.clientWidth + 1,
    overflow,
    undersizedControls,
    brokenImages,
  };
})()`;

async function main() {
  await mkdir(outputDir, { recursive: true });
  await mkdir(path.join(outputDir, "screenshots"), { recursive: true });

  const port = 9400 + Math.floor(Math.random() * 300);
  const profileDir = path.join(tmpdir(), `maison-elan-mobile-audit-${randomUUID()}`);
  const browser = spawn(browserPath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    "about:blank",
  ], { stdio: "ignore", windowsHide: true });

  let client;
  try {
    await waitForBrowser(port);
    const tabResponse = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
    const tab = await tabResponse.json();
    client = new CdpClient(tab.webSocketDebuggerUrl);
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });

    await client.send("Page.navigate", { url: baseUrl });
    await waitForPage(client);
    await client.send("Runtime.evaluate", {
      expression: `localStorage.setItem("maison-elan-cart", JSON.stringify([{slug:"cuticle-elixir",quantity:2},{slug:"hand-veil",quantity:1}])); sessionStorage.setItem("maison-elan-booking", JSON.stringify({serviceSlug:"atelier-gel",addOnIds:["french"],artistSlug:"mina-park",date:"2026-09-03",time:"11:00 AM",firstName:"Avery",lastName:"Morgan",email:"avery@example.com",phone:"2145550147",notes:"Short almond, sheer blush.",sms:true,deposit:true,bookingId:""}));`,
    });

    const results = [];
    for (const width of widths) {
      await client.send("Emulation.setDeviceMetricsOverride", {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: true,
        screenWidth: width,
        screenHeight: 900,
      });

      for (const route of routes) {
        const url = new URL(route, baseUrl).href;
        try {
          await client.send("Page.navigate", { url });
          await waitForPage(client);

          if (route === "/book/date-time") {
            await client.send("Runtime.evaluate", {
              expression: `(() => { const day = [...document.querySelectorAll("button")].find((button) => /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/.test(button.innerText.trim())); day?.click(); })()`,
            });
            await wait(250);
          }

          const evaluated = await client.send("Runtime.evaluate", {
            expression: auditExpression,
            returnByValue: true,
            awaitPromise: true,
          });
          results.push({ width, route, ok: true, ...evaluated.result.value });

          if (captureScreenshots && (width === 320 || width === 430) && screenshotRoutes.has(route)) {
            const shot = await client.send("Page.captureScreenshot", {
              format: "png",
              fromSurface: true,
              captureBeyondViewport: false,
            });
            await writeFile(
              path.join(outputDir, "screenshots", `${routeName(route)}-${width}.png`),
              Buffer.from(shot.data, "base64"),
            );
          }
        } catch (error) {
          results.push({ width, route, ok: false, error: error instanceof Error ? error.message : String(error) });
        }
      }
    }

    const report = {
      generatedAt: new Date().toISOString(),
      baseUrl,
      mode: quick ? "quick" : "full",
      widths,
      routes,
      results,
    };
    await writeFile(path.join(outputDir, "report.json"), JSON.stringify(report, null, 2));

    const failures = results.filter((result) => !result.ok);
    const horizontal = results.filter((result) => result.hasHorizontalScroll);
    const overflow = results.filter((result) => result.overflow?.length);
    const brokenImages = results.filter((result) => result.brokenImages?.length);
    console.log(JSON.stringify({
      checks: results.length,
      failures: failures.length,
      horizontalScrollCases: horizontal.length,
      overflowCases: overflow.length,
      brokenImageCases: brokenImages.length,
      report: path.join(outputDir, "report.json"),
    }, null, 2));
    if (failures.length || horizontal.length || overflow.length) process.exitCode = 1;
  } finally {
    client?.close();
    browser.kill();
    await wait(300);
    if (profileDir.startsWith(path.join(tmpdir(), "maison-elan-mobile-audit-"))) {
      await rm(profileDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
