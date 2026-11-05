"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { LiquidNavbar } from "@/components/ui/liquid-glass-navbar";
import type { ReactNode } from "react";
const Gallery = dynamic(() => import("@/components/ui/connoisseur-stack-interactor").then(m => m.Component), { loading: () => <div className="min-h-[600px]" /> });
const items = [{ label: "El producto", href: "#producto", fx: "none" as const }, { label: "Cómo funciona", href: "#inspiracion", fx: "none" as const }, { label: "Precios", href: "#precios", fx: "none" as const }];
export function LandingNavigation() { return <LiquidNavbar items={items} compact={false} sound={false} className="landing-nav" />; }
function DeferredSection({ children, placeholderClassName }: { children: ReactNode; placeholderClassName: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: "300px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={container}>{visible ? children : <div className={placeholderClassName} aria-hidden="true" />}</div>;
}
export function InspirationGallery() { return <DeferredSection placeholderClassName="min-h-[600px]"><Gallery /></DeferredSection>; }
export function DeferredPricing({ children }: { children: ReactNode }) { return <DeferredSection placeholderClassName="min-h-[1500px] md:min-h-[600px]">{children}</DeferredSection>; }
