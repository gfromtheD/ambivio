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
  const content = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const [savedHeight, setSavedHeight] = useState<number | null>(null);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => { setVisible(true); setNearViewport(true); });
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        setNearViewport(true);
      } else {
        const height = content.current?.getBoundingClientRect().height;
        if (height) setSavedHeight(height);
        setNearViewport(false);
      }
    }, { rootMargin: "300px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={container}>
    {visible ? <div ref={content} style={{ display: nearViewport ? undefined : "none" }}>{children}</div> : null}
    {!nearViewport ? <div className={savedHeight === null ? placeholderClassName : undefined} style={savedHeight === null ? undefined : { height: savedHeight }} aria-hidden="true" /> : null}
  </div>;
}
export function InspirationGallery() { return <DeferredSection placeholderClassName="min-h-[600px]"><Gallery /></DeferredSection>; }
export function DeferredPricing({ children }: { children: ReactNode }) { return <DeferredSection placeholderClassName="min-h-[1500px] md:min-h-[600px]">{children}</DeferredSection>; }
