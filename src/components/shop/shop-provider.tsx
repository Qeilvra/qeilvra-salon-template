"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { products } from "@/lib/site-data";

type CartItem = { slug: string; quantity: number };
type ShopContextValue = {
  cart: CartItem[];
  count: number;
  subtotal: number;
  addItem: (slug: string, quantity?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("maison-elan-cart");
      if (saved) setCart(JSON.parse(saved) as CartItem[]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("maison-elan-cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  const value = useMemo<ShopContextValue>(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => {
      const product = products.find((candidate) => candidate.slug === item.slug);
      return sum + (product?.price ?? 0) * item.quantity;
    }, 0);

    return {
      cart,
      count,
      subtotal,
      addItem(slug, quantity = 1) {
        setCart((current) => {
          const existing = current.find((item) => item.slug === slug);
          return existing
            ? current.map((item) => (item.slug === slug ? { ...item, quantity: item.quantity + quantity } : item))
            : [...current, { slug, quantity }];
        });
        toast.success("Added to your ritual", { description: "Your item is waiting in the bag." });
      },
      removeItem(slug) {
        setCart((current) => current.filter((item) => item.slug !== slug));
      },
      updateQuantity(slug, quantity) {
        if (quantity <= 0) {
          setCart((current) => current.filter((item) => item.slug !== slug));
          return;
        }
        setCart((current) => current.map((item) => (item.slug === slug ? { ...item, quantity } : item)));
      },
      clearCart() {
        setCart([]);
      },
    };
  }, [cart]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used inside ShopProvider");
  return context;
}

