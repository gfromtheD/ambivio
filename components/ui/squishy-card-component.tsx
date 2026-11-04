"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

type Props = { name: string; price: number; credits: number; featured?: boolean };
export default function SquishyCard({ name, price, credits, featured = false }: Props) {
  const reduce = useReducedMotion();
  return <motion.article whileHover={reduce ? undefined : "hover"} transition={{ duration: .45, ease: "backInOut" }} variants={{ hover: { scale: 1.025 } }} className={`relative flex min-h-[390px] flex-col overflow-hidden rounded-xl border p-8 ${featured ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-950"}`}>
    <div className="relative z-10">
      <span className="mb-7 inline-flex rounded-full border border-current/25 px-3 py-1 text-sm">{name}</span>
      <p className="font-heading text-6xl font-medium tracking-tight">{price} €</p>
      <p className="mt-2 text-sm opacity-65">Pago único · {credits} créditos</p>
      <p className="mt-7 max-w-56 text-base leading-relaxed">{credits} generaciones para explorar nuevas posibilidades en tus inmuebles.</p>
    </div>
    <Link href="/register" className={`relative z-20 mt-10 block rounded border px-5 py-3 text-center text-sm font-medium transition-colors ${featured ? "border-white bg-white text-black hover:bg-white/85" : "border-neutral-900 hover:bg-neutral-900 hover:text-white"}`}>Crear cuenta <span aria-hidden="true">↗</span></Link>
    <motion.svg aria-hidden="true" width="320" height="384" viewBox="0 0 320 384" className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[.06]" variants={{ hover: { scale: 1.5 } }} transition={{ duration: 1, ease: "backInOut" }}>
      <motion.circle variants={{ hover: { scaleY: .5, y: -25 } }} transition={{ duration: 1, ease: "backInOut", delay: .2 }} cx="160.5" cy="114.5" r="101.5" fill="currentColor" />
      <motion.ellipse variants={{ hover: { scaleY: 2.25, y: -25 } }} transition={{ duration: 1, ease: "backInOut", delay: .2 }} cx="160.5" cy="265.5" rx="101.5" ry="43.5" fill="currentColor" />
    </motion.svg>
  </motion.article>;
}
