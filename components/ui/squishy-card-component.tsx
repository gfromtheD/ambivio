"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

type Props = { name: string; price: number; credits: number; variant: "starter" | "pro" | "agency" };
const transition = { duration: .8, ease: "backInOut" as const };
export default function SquishyCard({ name, price, credits, variant }: Props) {
  const reduce = useReducedMotion();
  const pro = variant === "pro";
  return <motion.article initial="rest" whileHover={reduce ? undefined : "hover"} whileFocus={reduce ? undefined : "hover"} className={`relative flex min-h-[480px] flex-col overflow-hidden rounded-xl p-8 ${pro ? "bg-neutral-950 text-white" : variant === "agency" ? "bg-neutral-800 text-white" : "bg-neutral-200 text-neutral-950"}`}>
    <div className="relative z-10"><h3 className="text-xl font-medium">{name}</h3><p className="mt-5 font-heading text-6xl font-medium tracking-tight">{price} €</p><p className={`mt-3 text-base ${pro || variant === "agency" ? "text-neutral-300" : "text-neutral-700"}`}>{credits} créditos · Pago único</p></div>
    <motion.svg aria-hidden="true" viewBox="0 0 320 220" className={`relative my-6 h-40 w-full ${variant === "starter" ? "text-white" : "text-neutral-400"}`} transition={transition}>
      {variant === "starter" ? <motion.circle cx="160" cy="110" r="72" variants={{rest:{scale:1},hover:{scaleX:1.35,scaleY:.7,rotate:15}}} transition={transition} fill="currentColor" /> : variant === "pro" ? <>
        <motion.circle cx="160" cy="72" r="65" variants={{hover:{scaleY:.65,y:18}}} transition={transition} fill="currentColor" />
        <motion.ellipse cx="160" cy="170" rx="65" ry="26" variants={{hover:{scaleY:1.7,y:-10}}} transition={transition} fill="currentColor" />
      </> : <>{[0,1,2].map(i=><motion.rect key={i} x={55+i*70} y={50-i*10} width="62" height={120+i*10} rx="3" variants={{hover:{y:(1-i)*20,scaleY:1+i*.12,rotate:(i-1)*8}}} transition={{...transition,delay:i*.08}} fill="currentColor" />)}</>}
    </motion.svg>
    <Link href="/register" className={`relative z-20 mt-auto block rounded border px-5 py-3 text-center text-sm font-medium transition-colors ${pro || variant === "agency" ? "border-white bg-white text-neutral-950 hover:bg-neutral-200" : "border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-700"}`}>Elegir {name.replace("Pack ", "")} <span aria-hidden="true">↗</span></Link>
  </motion.article>;
}
