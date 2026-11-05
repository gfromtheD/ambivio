import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AmbivioMark } from "@/components/brand/ambivio-mark";
import { InspirationGallery, LandingNavigation } from "@/components/landing/landing-interactions";
import PricingSection3 from "@/components/ui/pricing-section-3";
import { CREDIT_PACKAGES } from "@/lib/stripe";

export const metadata: Metadata = { title: "Ambivio · Un espacio. Distintos futuros.", description: "Un espacio de trabajo para preparar fotografías inmobiliarias, explorar estilos y organizar cada inmueble. Descubre Ambivio." };
const faqs = [
  ["¿Qué es el virtual staging?", "Es una forma de visualizar cómo podría amueblarse un espacio a partir de su fotografía. La imagen original sigue siendo la referencia: una propuesta visual no sustituye la realidad del inmueble."],
  ["¿Cómo se organiza el trabajo?", "Crea un inmueble, añade sus estancias y sube las fotografías. Desde cada estancia puedes configurar el estilo y consultar su historial de generaciones."],
  ["¿Dónde gestiono mis créditos?", "Dentro de tu cuenta, en Configuración. Allí puedes consultar el saldo y los paquetes disponibles antes de comprar. Los precios mostrados aquí corresponden a los paquetes del producto."],
  ["¿Las imágenes de esta página son resultados de Ambivio?", "No. Son fotografías de inspiración para mostrar direcciones de interiorismo. La generación con un proveedor de IA real sigue en validación; estas imágenes no se presentan como resultados del servicio."],
];
export default function HomePage() {
 return <div className="landing bg-background text-foreground">
  <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:p-4">Saltar al contenido</a>
  <header className="landing-header mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-5 px-6 py-6 md:px-12">
    <Link href="/" aria-label="Ambivio, inicio"><AmbivioMark /></Link>
    <div className="order-3 flex w-full justify-center lg:order-none lg:w-auto"><LandingNavigation /></div>
    <Link href="/login" className="landing-button">Descubrir Ambivio <span aria-hidden="true">↗</span></Link>
  </header>
  <main id="contenido">
    <section id="producto" className="mx-auto max-w-[1600px] pt-20 pb-24 md:pt-32 md:pb-36">
      <h1 className="mx-auto mb-16 max-w-[1440px] px-6 font-heading text-[clamp(3.5rem,8.8vw,9rem)] leading-[1.02] font-medium tracking-[-.055em] md:mb-24 md:px-12">Un espacio.<br/><span className="text-neutral-500">Distintos futuros.</span></h1>
      <figure className="relative"><div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 md:aspect-[1.8/1]"><Image src="/images/salon.jpg" alt="Salón luminoso con materiales naturales y mobiliario contemporáneo. Fotografía de inspiración." fill priority sizes="100vw" className="object-cover" /></div></figure>
    </section>
    <section id="inspiracion" className="mx-auto max-w-[1400px] px-6 md:px-12"><h2 className="landing-title">Del espacio a la propuesta.</h2><InspirationGallery /></section>
    <section id="precios" className="px-6 pb-28 md:px-12 md:pb-40"><PricingSection3 plans={CREDIT_PACKAGES} /></section>
    <section className="mx-auto max-w-[850px] px-6 py-28 md:px-12 md:py-40"><h2 className="landing-title mb-16 text-center">Preguntas frecuentes.</h2><div>{faqs.map(([q,a])=><details key={q} className="group border-t py-7 last:border-b"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-medium">{q}<span aria-hidden="true" className="text-xl group-open:rotate-45">+</span></summary><p className="mt-5 text-base leading-relaxed text-muted-foreground">{a}</p></details>)}</div></section>
    <section className="bg-neutral-950 px-6 py-20 text-white md:px-12"><div className="mx-auto flex max-w-[1200px] flex-wrap items-end justify-between gap-10"><div><h2 className="landing-title">Empieza por un espacio.</h2></div><Link href="/register" className="inline-flex items-center gap-10 rounded-md bg-white px-6 py-4 text-sm font-medium text-black hover:bg-neutral-200">Crear mi cuenta <span aria-hidden="true">↗</span></Link></div></section>
  </main>
  <footer className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-8 px-6 py-10 md:px-12"><div><AmbivioMark /></div><nav aria-label="Enlaces de pie" className="flex gap-6 text-sm"><a href="#precios">Precios</a><Link href="/login">Iniciar sesión</Link><Link href="/register">Crear cuenta</Link></nav><p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Ambivio</p></footer>
 </div>;
}
