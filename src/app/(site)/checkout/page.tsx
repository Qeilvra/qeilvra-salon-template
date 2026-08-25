import type { Metadata } from "next";
import { CheckoutForm } from "@/components/shop/checkout-form";

export const metadata:Metadata={title:"Secure Checkout",robots:{index:false,follow:false}};
export default function CheckoutPage(){return <section className="min-h-[70vh] py-14 sm:py-20"><div className="container-shell"><CheckoutForm/></div></section>}

