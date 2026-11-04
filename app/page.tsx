import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AmbivioMark } from "@/components/brand/ambivio-mark";
import { InspirationGallery, LandingNavigation } from "@/components/landing/landing-interactions";
import SquishyCard from "@/components/ui/squishy-card-component";
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
    <div className="landing-auth flex items-center gap-4 text-sm"><Link href="/login" className="hover:underline">Iniciar sesión</Link><Link href="/register" className="landing-button">Crear cuenta <span aria-hidden="true">↗</span></Link></div>
  </header>
  <main id="contenido">
    <section id="producto" className="mx-auto max-w-[1440px] px-6 pt-14 pb-16 md:px-12 md:pt-24">
      <div className="mb-14 grid items-end gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div><p className="landing-eyebrow mb-6">Virtual staging para inmobiliarias</p><h1 className="font-heading text-[clamp(3.1rem,7vw,7rem)] leading-[1.02] font-medium tracking-[-.055em]">Un espacio.<br/><span className="text-neutral-500">Distintos futuros.</span></h1></div>
        <div className="max-w-sm lg:pb-2"><p className="text-lg leading-relaxed text-muted-foreground">Cada inmueble tiene algo por mostrar. Prepara sus fotografías, explora posibilidades y reúne todo el trabajo en un mismo lugar.</p><div className="mt-7 flex flex-wrap items-center gap-5"><Link href="/register" className="landing-button">Descubrir Ambivio <span aria-hidden="true">↗</span></Link><a href="#inspiracion" className="text-sm underline underline-offset-4">Explorar espacios</a></div><p className="mt-4 text-xs text-muted-foreground">Acceso de prueba · Generación con IA en validación</p></div>
      </div>
      <figure className="relative"><div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 md:aspect-[2.25/1]"><Image src="/images/salon.jpg" alt="Salón luminoso con materiales naturales y una composición de mobiliario contemporáneo" fill priority sizes="(max-width: 768px) 100vw, 1400px" className="object-cover" /></div><figcaption className="flex justify-between gap-4 border-b py-4 text-xs text-muted-foreground"><span>01 / Un lugar para imaginar</span><span>Fotografía de inspiración · No es un resultado generado</span></figcaption></figure>
      <div className="mt-10 grid gap-8 md:grid-cols-3">{[["01", "Organiza", "Un inmueble, sus estancias y todas sus fotografías. Cada cosa en su lugar."],["02", "Explora", "Define la estancia y la dirección visual que quieres estudiar."],["03", "Revisa", "Conserva la referencia original y consulta el historial de cada espacio."]].map(([n,t,d])=><div key={n} className="flex gap-5"><span className="pt-1 text-xs text-muted-foreground">{n}</span><div><h2 className="font-heading text-xl">{t}</h2><p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{d}</p></div></div>)}</div>
    </section>
    <section id="precios" className="border-y bg-neutral-50 px-6 py-20 md:px-12 md:py-28"><div className="mx-auto max-w-[1200px]"><div className="mb-12 flex flex-wrap items-end justify-between gap-6"><div><p className="landing-eyebrow mb-4">Precios</p><h2 className="landing-title">A tu ritmo.<br/>Según tu trabajo.</h2></div><p className="max-w-xs text-sm leading-relaxed text-muted-foreground">Paquetes de créditos disponibles en tu cuenta. Consulta las condiciones finales antes de confirmar cualquier compra.</p></div><div className="grid gap-5 md:grid-cols-3">{CREDIT_PACKAGES.map(p=><SquishyCard key={p.id} name={p.name} price={p.priceEur} credits={p.credits} featured={p.id === "pro"} />)}</div><p className="mt-6 text-center text-xs text-muted-foreground">La compra se gestiona dentro de tu cuenta. Esta página no inicia ningún pago.</p></div></section>
    <section id="inspiracion" className="mx-auto max-w-[1300px] px-6 pt-20 md:px-12 md:pt-28"><p className="landing-eyebrow mb-4">Direcciones visuales</p><h2 className="landing-title">El carácter de cada espacio.</h2><p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">Distintas estancias, una misma atención a la luz, los materiales y la proporción. Selecciona una para explorar la colección.</p><InspirationGallery /><p className="border-t py-4 text-xs text-muted-foreground">Colección de inspiración · Fotografías de Unsplash · No son ejemplos de generación de Ambivio.</p></section>
    <section className="mx-auto grid max-w-[1300px] gap-12 px-6 py-24 md:grid-cols-[.8fr_1.2fr] md:px-12"><div><p className="landing-eyebrow mb-4">Antes de empezar</p><h2 className="landing-title">Con claridad.</h2></div><div>{faqs.map(([q,a])=><details key={q} className="group border-t py-6 last:border-b"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-medium">{q}<span aria-hidden="true" className="text-xl group-open:rotate-45">+</span></summary><p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">{a}</p></details>)}</div></section>
    <section className="bg-neutral-950 px-6 py-20 text-white md:px-12"><div className="mx-auto flex max-w-[1200px] flex-wrap items-end justify-between gap-10"><div><p className="landing-eyebrow mb-5 text-neutral-400">Tu próximo inmueble</p><h2 className="landing-title">Empieza por un espacio.</h2><p className="mt-5 text-neutral-400">Dale un lugar a todas sus posibilidades.</p></div><Link href="/register" className="inline-flex items-center gap-10 rounded-md bg-white px-6 py-4 text-sm font-medium text-black hover:bg-neutral-200">Crear mi cuenta <span aria-hidden="true">↗</span></Link></div></section>
  </main>
  <footer className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-8 px-6 py-10 md:px-12"><div><AmbivioMark /><p className="mt-3 text-xs text-muted-foreground">Un espacio. Distintos futuros.</p></div><nav aria-label="Enlaces de pie" className="flex gap-6 text-sm"><a href="#precios">Precios</a><Link href="/login">Iniciar sesión</Link><Link href="/register">Crear cuenta</Link></nav><p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Ambivio</p></footer>
 </div>;
}
