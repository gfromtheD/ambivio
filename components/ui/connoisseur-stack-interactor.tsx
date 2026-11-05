"use client";
import { cn } from "@/lib/utils";
import { useRef, useState, useLayoutEffect, useCallback, useId } from "react";
import gsap from "gsap";

interface MenuItem {
  num: string;
  name: string;
  description: string;
  clipId: string;
  image: string;
}

const defaultItems: MenuItem[] = [
  {
    num: "01",
    name: "Organiza",
    description: "Reúne cada inmueble, sus estancias y sus fotografías en un mismo lugar. Mantén una referencia clara del espacio original y retoma el trabajo sin perder el contexto.",
    clipId: "clip-original",
    image: "/images/salon.jpg"
  },
  {
    num: "02",
    name: "Explora",
    description: "Define el tipo de estancia y el estilo que quieres estudiar. Explora una dirección visual para ese espacio y conserva sus distintas versiones para revisarlas con criterio.",
    clipId: "clip-hexagons",
    image: "/images/dormitorio.jpg"
  },
  {
    num: "03",
    name: "Revisa",
    description: "Consulta el historial de cada estancia y contrasta las propuestas con la fotografía original. Revisa cada detalle antes de descargar el resultado que quieras utilizar.",
    clipId: "clip-pixels",
    image: "/images/comedor.jpg"
  }
];

export const Component = ({
  items = defaultItems,
  className
}: { items?: MenuItem[]; className?: string }) => {
  const descriptionId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<SVGImageElement>(null);
  const mainGroupRef = useRef<SVGGElement>(null);
  const masterTl = useRef<gsap.core.Timeline | null>(null);

  const createLoop = useCallback((index: number) => {
    const item = items[index];
    const selector = `#${item.clipId} .path`;

    if (masterTl.current) masterTl.current.kill();

    if (imageRef.current) imageRef.current.setAttribute("href", item.image);
    if (mainGroupRef.current) mainGroupRef.current.setAttribute("clip-path", `url(#${item.clipId})`);
    
    gsap.set(selector, { scale: 0, transformOrigin: "50% 50%" });

    const tiles = containerRef.current?.querySelectorAll<SVGRectElement>(selector);
    const finalGeometry = (element: SVGRectElement) => ({
      x: Number(element.dataset.finalX ?? element.getAttribute("x")),
      y: Number(element.dataset.finalY ?? element.getAttribute("y")),
      width: Number(element.dataset.finalWidth ?? element.getAttribute("width")),
      height: Number(element.dataset.finalHeight ?? element.getAttribute("height")),
      rx: 0,
    });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tiles?.forEach(tile => gsap.set(tile, { scale: 1, attr: finalGeometry(tile) }));
      return;
    }
    const tl = gsap.timeline();

    // 1. IN (Expo Out)
    tl.to(selector, {
      scale: 1,
      attr: {
        x: (_: number, tile: SVGRectElement) => finalGeometry(tile).x,
        y: (_: number, tile: SVGRectElement) => finalGeometry(tile).y,
        width: (_: number, tile: SVGRectElement) => finalGeometry(tile).width,
        height: (_: number, tile: SVGRectElement) => finalGeometry(tile).height,
        rx: 0,
      },
      duration: 0.8,
      stagger: { amount: 0.4, from: "random" },
      ease: "expo.out",
    })
    // Expand each distinct mask until its pieces meet, then show the full image.
    .to(selector, {
      scale: 1,
      duration: .65,
      ease: "sine.inOut",
      stagger: { amount: 0.2, from: "center" }
    })
    ;

    // Each mask fills its own tiled footprint during the same entrance as 01.
    // Keep the mask in place: there is no timed switch to an unmasked image.
    masterTl.current = tl;
  }, [items]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      createLoop(activeIndex);
    }, containerRef);
    return () => ctx.revert();
  }, [createLoop, activeIndex]);

  const handleItemHover = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "flex flex-col md:flex-row items-center justify-between w-full pt-[var(--landing-inner-gap)] overflow-hidden transition-colors duration-500",
        "bg-white dark:bg-[#050505]", 
        className
      )}
    >
      
      {/* LEFT SIDE: HIGH CONTRAST MENU */}
      <div className="z-20 w-full md:w-1/2">
        <nav aria-label="Cómo funciona Ambivio">
          <ul className="flex flex-col gap-10">
            {items.map((item, index) => (
              <li
                key={item.num}
                onMouseEnter={() => handleItemHover(index)}
                className="group cursor-pointer"
              >
                <button type="button" onClick={() => handleItemHover(index)} onFocus={() => handleItemHover(index)} aria-expanded={activeIndex === index} aria-controls={`${descriptionId}-${index}`} className="flex w-full items-start gap-6 text-left focus-visible:outline-2 focus-visible:outline-offset-8">
                  {/* Main Text: Enhanced visibility logic */}
                  <h2 className={cn(
                    "font-heading text-4xl md:text-5xl font-medium tracking-tighter leading-[1.1] transition-all duration-700",
                    activeIndex === index 
                      ? "text-zinc-950 dark:text-white opacity-100" 
                      // INACTIVE STATE: Increased from Zinc-200 to Zinc-400 for Light Mode
                      // Increased stroke visibility for Dark Mode (#52525b is Zinc-600)
                      : "opacity-40 " + 
                        "text-zinc-500 dark:text-transparent " + 
                        "dark:[text-stroke:1.5px_#52525b] dark:[-webkit-text-stroke:1.5px_#52525b]"
                  )}>
                    {item.name}
                  </h2>
                </button>
                <div id={`${descriptionId}-${index}`} aria-hidden={activeIndex !== index} className={cn("space-benefit-reveal grid", activeIndex === index ? "grid-rows-[1fr] is-open" : "grid-rows-[0fr]")}>
                  <div className="space-benefit-mask overflow-hidden"><p className={cn("space-benefit-copy max-w-[390px] pt-5 pr-5 pb-1 text-base leading-relaxed text-neutral-600 dark:text-neutral-300", activeIndex === index ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0")}>{item.description}</p></div>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* RIGHT SIDE: SQUARE GRID (Sharp Squares) */}
      <div className="relative w-full md:w-1/2 flex justify-center items-center mt-10 md:mt-0">
        <div className="absolute w-[120%] h-[120%] bg-transparent blur-[120px] rounded-full transition-opacity duration-1000" />
        
        <svg role="img" aria-label={items[activeIndex].name} viewBox="0 0 500 500" className="w-[100%] max-w-[500px] h-auto z-10  dark:drop-shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          <defs>
            <clipPath id="clip-original">
              {Array.from({ length: 5 }).map((_, i) => <rect key={i} className="path" x="0" y={i * 100} width="500" height="102" />)}
            </clipPath>

            <clipPath id="clip-hexagons">
              <rect className="path" data-final-x="0" data-final-y="0" data-final-width="231" data-final-height="311" x="20" y="20" width="200" height="280" rx="12" />
              <rect className="path" data-final-x="0" data-final-y="310" data-final-width="231" data-final-height="190" x="20" y="320" width="200" height="160" rx="12" />
              <rect className="path" data-final-x="230" data-final-y="0" data-final-width="270" data-final-height="161" x="240" y="20" width="240" height="140" rx="12" />
              <rect className="path" data-final-x="230" data-final-y="160" data-final-width="136" data-final-height="191" x="240" y="180" width="110" height="160" rx="12" />
              <rect className="path" data-final-x="365" data-final-y="160" data-final-width="135" data-final-height="191" x="370" y="180" width="110" height="160" rx="12" />
              <rect className="path" data-final-x="230" data-final-y="350" data-final-width="270" data-final-height="150" x="240" y="360" width="240" height="120" rx="12" />
            </clipPath>

            {/* Grid Squares with rx="4" as requested */}
            <clipPath id="clip-pixels">
              {Array.from({ length: 9 }).map((_, i) => (
                <rect
                  key={i}
                  className="path"
                  data-final-x={(i % 3) * (500 / 3)}
                  data-final-y={Math.floor(i / 3) * (500 / 3)}
                  data-final-width={500 / 3 + 1}
                  data-final-height={500 / 3 + 1}
                  x={(i % 3) * 160 + 20}
                  y={Math.floor(i / 3) * 160 + 20}
                  width="140"
                  height="140"
                  rx="4" 
                />
              ))}
            </clipPath>
          </defs>

          <g ref={mainGroupRef} clipPath={`url(#${items[activeIndex].clipId})`}>
            <image
              ref={imageRef}
              href={items[activeIndex].image}
              width="500"
              height="500"
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};