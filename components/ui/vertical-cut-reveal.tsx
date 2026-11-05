"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = { children: string; reverse?: boolean; splitBy?: "words" | "characters" | "lines"; staggerDuration?: number; staggerFrom?: "first" | "last" | "center"; containerClassName?: string; transition?: Transition };
export function VerticalCutReveal({ children, reverse = false, splitBy = "words", staggerDuration = .15, staggerFrom = "first", containerClassName, transition = { type: "spring", stiffness: 250, damping: 40 } }: Props) {
  const reduce = useReducedMotion();
  const parts = children.split(splitBy === "characters" ? "" : splitBy === "lines" ? "\n" : " ");
  return <span className={cn("flex flex-wrap whitespace-pre-wrap", splitBy === "lines" && "flex-col", containerClassName)}><span className="sr-only">{children}</span>{parts.map((part, i) => {
    const order = staggerFrom === "last" ? parts.length - 1 - i : staggerFrom === "center" ? Math.abs((parts.length - 1) / 2 - i) : i;
    return <span key={i} aria-hidden="true" className="inline-flex overflow-hidden"><motion.span className="inline-block" initial={reduce ? false : { y: reverse ? "-100%" : "100%" }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={reduce ? { duration: 0 } : { ...transition, delay: (transition.delay ?? 0) + order * staggerDuration }}>{part}</motion.span>{splitBy === "words" && i < parts.length - 1 ? <span> </span> : null}</span>;
  })}</span>;
}
