"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

type Props = { name: string; price: number; credits: number; variant: "starter" | "pro" | "agency" };
const transition = { duration: 1, ease: "backInOut" as const };
const shapeTransition = { ...transition, delay: .2 };

export default function SquishyCard({ name, price, credits, variant }: Props) {
  const reduce = useReducedMotion();
  const background = variant === "starter" ? "bg-neutral-600" : variant === "pro" ? "bg-neutral-500" : "bg-neutral-700";
  return (
    <motion.article
      whileHover={reduce ? undefined : "hover"}
      whileFocus={reduce ? undefined : "hover"}
      transition={transition}
      variants={{ hover: { scale: 1.05 } }}
      className={`relative mx-auto h-96 w-80 max-w-full shrink-0 overflow-hidden rounded-xl p-8 ${background}`}
    >
      <div className="relative z-10 text-white">
        <h3 className="mb-3 block w-fit rounded-full bg-white/30 px-3 py-0.5 text-sm font-light">{name}</h3>
        <motion.p initial={{ scale: .85 }} variants={{ hover: { scale: 1 } }} transition={transition} className="my-2 block origin-top-left font-heading text-6xl font-bold leading-[1.2]">
          {price} €
        </motion.p>
        <p className="mt-4 text-base leading-relaxed">{credits} créditos.<br/>Un único pago.</p>
      </div>
      <Link href="/register" className="absolute right-4 bottom-4 left-4 z-20 rounded border-2 border-white bg-white py-2 text-center text-sm font-bold text-neutral-800 backdrop-blur transition-colors hover:bg-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
        Elegir {name.replace("Pack ", "")}
      </Link>
      <motion.svg aria-hidden="true" width="320" height="384" viewBox="0 0 320 384" fill="none" className="pointer-events-none absolute inset-0 z-0 h-full w-full" variants={{ hover: { scale: 1.5 } }} transition={transition}>
        {variant === "pro" ? <>
          <motion.circle variants={{ hover: { scaleY: .5, y: -25 } }} transition={shapeTransition} cx="160.5" cy="114.5" r="101.5" fill="#262626" />
          <motion.ellipse variants={{ hover: { scaleY: 2.25, y: -25 } }} transition={shapeTransition} cx="160.5" cy="265.5" rx="101.5" ry="43.5" fill="#262626" />
        </> : variant === "starter" ? <>
          <motion.rect variants={{ hover: { scaleY: .5, y: -25 } }} transition={shapeTransition} x="59" y="13" width="203" height="203" rx="14" fill="#262626" />
          <motion.rect variants={{ hover: { scaleY: 2.25, y: -25 } }} transition={shapeTransition} x="59" y="222" width="203" height="87" rx="14" fill="#262626" />
        </> : <>
          <motion.path variants={{ hover: { scaleY: .5, y: -25 } }} transition={shapeTransition} d="M160.5 13L262 114.5L160.5 216L59 114.5Z" fill="#262626" />
          <motion.path variants={{ hover: { scaleY: 2.25, y: -25 } }} transition={shapeTransition} d="M160.5 222L262 265.5L160.5 309L59 265.5Z" fill="#262626" />
        </>}
      </motion.svg>
    </motion.article>
  );
}
