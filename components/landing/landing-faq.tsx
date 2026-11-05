"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = { items: readonly (readonly string[])[] };
export function LandingFaq({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const id = useId();
  const reduce = useReducedMotion();
  return <div>{items.map(([question, answer], index) => {
    const open = openIndex === index;
    return <div key={question} className="py-1">
      <h3><button id={`${id}-question-${index}`} type="button" aria-expanded={open} aria-controls={`${id}-answer-${index}`} onClick={() => setOpenIndex(open ? null : index)} className="group flex w-full cursor-pointer items-center justify-between gap-6 py-7 text-left text-lg leading-snug font-medium md:text-xl focus-visible:outline-2 focus-visible:outline-offset-4">
        <span className="transition-colors duration-200 group-hover:text-neutral-500">{question}</span>
        <motion.span aria-hidden="true" className="relative flex size-6 shrink-0 items-center justify-center" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduce ? 0 : .35, ease: [.22, 1, .36, 1] }}>
          <span className="absolute h-px w-3 bg-current" />
          <motion.span className="absolute h-3 w-px bg-current" animate={{ scaleY: open ? 0 : 1, opacity: open ? 0 : 1 }} transition={{ duration: reduce ? 0 : .2 }} />
        </motion.span>
      </button></h3>
      <div id={`${id}-answer-${index}`} role="region" aria-labelledby={`${id}-question-${index}`}>
        <AnimatePresence initial={false}>
          {open ? <motion.div key="answer" initial={{ height: 0, opacity: reduce ? 1 : 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: reduce ? 1 : 0 }} transition={{ height: { duration: reduce ? 0 : .5, ease: [.22, 1, .36, 1] }, opacity: { duration: reduce ? 0 : .25 } }} className="overflow-hidden">
            <motion.div initial={reduce ? false : { y: -10, clipPath: "inset(0 0 100% 0)" }} animate={{ y: 0, clipPath: "inset(0 0 0% 0)" }} exit={reduce ? undefined : { y: -6, opacity: 0 }} transition={{ duration: reduce ? 0 : .65, ease: [.22, 1, .36, 1], delay: reduce ? 0 : .04 }} className="pb-7 pr-8">
              <p className="text-base leading-relaxed text-muted-foreground">{answer.split(/(?<=[.!?])\s+/).map((sentence, sentenceIndex) => <motion.span key={sentenceIndex} initial={reduce ? false : { opacity: 0, filter: "blur(3px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: reduce ? 0 : .45, delay: reduce ? 0 : .08 + sentenceIndex * .11 }}><span>{sentence} </span></motion.span>)}</p>
            </motion.div>
          </motion.div> : null}
        </AnimatePresence>
      </div>
    </div>;
  })}</div>;
}
