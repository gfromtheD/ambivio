"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LiquidNavbar } from "@/components/ui/liquid-glass-navbar";
import NumberFlow from "@number-flow/react";
import { useRef, useState, useId } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";

type Plan = { id: string; name: string; credits: number; priceEur: number };
const descriptions: Record<string, string> = {
  starter: "Para empezar con tus primeros inmuebles.",
  pro: "Para una cartera inmobiliaria activa.",
  agency: "Más capacidad para el trabajo de tu agencia.",
};
const includes = ["Organización por inmuebles y estancias", "Fotografías originales e historial", "Revisión y descarga de resultados"];
const revealVariants = {
  visible: (i: number) => ({ y: 0, opacity: 1, filter: "blur(0px)", transition: { delay: i * .4, duration: .5 } }),
  hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
};

export default function PricingSection3({ plans }: { plans: readonly Plan[] }) {
  const pricingRef = useRef<HTMLDivElement>(null);
  const [isYearly, setIsYearly] = useState(false);
  const switchId = useId();
  const reduce = useReducedMotion();
  const multiplier = isYearly ? 12 : 1;
  return <div ref={pricingRef} className="relative mx-auto max-w-7xl px-4 pt-8 pb-12 md:pt-12">
    <article className="mb-10 flex flex-wrap items-center justify-between gap-8 md:mb-16">
      <h2 className="landing-title"><VerticalCutReveal reverse staggerDuration={.15} transition={{ type: "spring", stiffness: 250, damping: 40 }}>Planes y precios.</VerticalCutReveal></h2>
      <div role="group" aria-label="Periodo de estimación" className="relative flex rounded-full border border-neutral-200 bg-neutral-50 p-1">
        {[false, true].map(yearly => <button key={String(yearly)} type="button" aria-pressed={isYearly === yearly} onClick={() => setIsYearly(yearly)} className="relative cursor-pointer rounded-full px-6 py-3 font-medium text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-4">
          {isYearly === yearly ? <motion.span layoutId={switchId} className="absolute inset-0 rounded-full border-4 border-neutral-300 bg-gradient-to-t from-neutral-100 via-neutral-200 to-neutral-300 shadow-sm shadow-neutral-300" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 30 }} /> : null}
          <span className="relative">{yearly ? "Anual" : "Mensual"}</span>
        </button>)}
      </div>
    </article>
    <p className="mb-10 text-sm text-muted-foreground">Estimación de 1 pack al mes o 12 al año. Los packs se compran por separado; no es una suscripción.</p>
    <TimelineContent animationNum={2} timelineRef={pricingRef} customVariants={revealVariants} className="mx-auto grid gap-4 rounded-lg bg-gradient-to-b from-neutral-100 to-neutral-200 p-3 md:grid-cols-3">
      {plans.map((plan, index) => {
        const popular = plan.id === "agency";
        return <TimelineContent key={plan.id} animationNum={index + 3} timelineRef={pricingRef} customVariants={revealVariants} className={cn("flex", popular && "relative z-10")}>
          <Card className={cn("relative flex w-full flex-col justify-between gap-0 overflow-visible [--card-spacing:--spacing(6)]", popular ? "bg-gradient-to-t from-black to-neutral-900 text-white ring-2 ring-neutral-900 md:scale-110" : "border-none bg-transparent pt-4 text-neutral-900 shadow-none")}>
            <CardContent className="pt-0">
              <div className="space-y-2 pb-3">
                {popular ? <div className="pt-4 pb-2"><span className="rounded-full bg-neutral-600 px-3 py-1 text-xs font-medium text-white">Mayor capacidad</span></div> : null}
                <div className="flex flex-wrap items-baseline gap-x-2"><NumberFlow value={plan.priceEur * multiplier} locales="es-ES" format={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }} className="font-heading text-4xl font-semibold" /><span className={popular ? "text-neutral-200" : "text-neutral-600"}>/{isYearly ? "año" : "mes"}</span></div>
              </div>
              <h3 className="mb-2 font-heading text-3xl font-semibold">{plan.name.replace("Pack ", "")}</h3>
              <p className={cn("mb-4 text-sm", popular ? "text-neutral-200" : "text-neutral-600")}>{descriptions[plan.id]}</p>
              <div className={cn("space-y-3 border-t pt-4", popular ? "border-neutral-700" : "border-neutral-300")}>
                <h4 className="mb-3 text-base font-medium">{plan.credits * multiplier} créditos / {isYearly ? "año" : "mes"}</h4>
                <ul className="space-y-3 font-semibold">{includes.map(feature => <li key={feature} className="flex items-start"><span className={cn("mt-0.5 mr-3 grid size-6 shrink-0 place-content-center rounded-full border", popular ? "border-neutral-500 bg-neutral-600 text-white" : "border-black bg-white text-black")}><svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m5 12 4 4L19 6" /></svg></span><span className={cn("text-sm", popular ? "text-neutral-100" : "text-neutral-600")}>{feature}</span></li>)}</ul>
              </div>
            </CardContent>
            <CardFooter className="mt-8 border-0 bg-transparent pt-0">
              <LiquidNavbar ariaLabel={`Acceso al pack ${plan.name}`} items={[{ label: "Empezar", href: "/register", fx: "none" }]} tone={popular ? "dark" : "light"} compact={false} sound={false} className={cn("pricing-liquid mb-6 w-full", popular && "pricing-liquid-dark")} />
            </CardFooter>
          </Card>
        </TimelineContent>;
      })}
    </TimelineContent>
  </div>;
}
