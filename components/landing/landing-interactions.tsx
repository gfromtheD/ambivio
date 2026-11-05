"use client";
import dynamic from "next/dynamic";
import { LiquidNavbar } from "@/components/ui/liquid-glass-navbar";
const Gallery = dynamic(() => import("@/components/ui/connoisseur-stack-interactor").then(m => m.Component), { loading: () => <div className="min-h-[600px]" /> });
const items = [{ label: "El producto", href: "#producto", fx: "none" as const }, { label: "Cómo funciona", href: "#inspiracion", fx: "none" as const }, { label: "Precios", href: "#precios", fx: "none" as const }];
export function LandingNavigation() { return <LiquidNavbar items={items} compact={false} sound={false} className="landing-nav" />; }
export function InspirationGallery() { return <Gallery />; }
