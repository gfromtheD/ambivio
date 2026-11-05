"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useRef, type ReactNode, type RefObject } from "react";

type Props = {
  as?: "div" | "p";
  animationNum?: number;
  timelineRef: RefObject<HTMLElement | null>;
  customVariants: Variants;
  className?: string;
  children: ReactNode;
};
export function TimelineContent({ as = "div", animationNum = 0, timelineRef, customVariants, className, children }: Props) {
  const ref = useRef<HTMLDivElement & HTMLParagraphElement>(null);
  const inView = useInView(timelineRef, { once: true, amount: .15 });
  const reduce = useReducedMotion();
  const Tag = as === "p" ? motion.p : motion.div;
  return <Tag ref={ref} custom={animationNum} initial={reduce ? false : "hidden"} animate={inView || reduce ? "visible" : "hidden"} variants={reduce ? undefined : customVariants} className={className}>{children}</Tag>;
}
