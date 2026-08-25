import type { Metadata } from "next";
import { CartView } from "@/components/shop/cart-view";

export const metadata:Metadata={title:"Your Bag",robots:{index:false,follow:false}};
export default function CartPage(){return <section className="min-h-[70vh] py-14 sm:py-20"><div className="container-shell"><CartView/></div></section>}

