"use client";
import { cn } from "@/lib/utils";
import { useRef, useState, useLayoutEffect, useCallback, useEffect } from "react";
import gsap from "gsap";

interface MenuItem {
  num: string;
  name: string;
  clipId: string;
  image: string;
}

const defaultItems: MenuItem[] = [
  {
    num: "01",
    name: "Salón contemporáneo",
    clipId: "clip-original",
    image: "/images/salon.jpg"
  },
  {
    num: "02",
    name: "Dormitorio sereno",
    clipId: "clip-hexagons",
    image: "/images/dormitorio.jpg"
  },
  {
    num: "03",
    name: "Comedor natural",
    clipId: "clip-pixels",
    image: "/images/comedor.jpg"
  }
];

export const Component = ({
  items = defaultItems,
  className
}: { items?: MenuItem[]; className?: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealComplete, setRevealComplete] = useState(false);
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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { mainGroupRef.current?.removeAttribute("clip-path"); return; }
    const tl = gsap.timeline({ onComplete: () => { mainGroupRef.current?.removeAttribute("clip-path"); } });

    // 1. IN (Expo Out)
    tl.to(selector, {
      scale: 1,
      duration: 0.8,
      stagger: { amount: 0.4, from: "random" },
      ease: "expo.out",
    })
    // Expand each distinct mask until its pieces meet, then show the full image.
    .to(selector, {
      scale: index === 0 ? 1 : index === 1 ? 1.24 : 1.3,
      duration: .65,
      ease: "sine.inOut",
      stagger: { amount: 0.2, from: "center" }
    })
    ;

    masterTl.current = tl;
  }, [items]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      createLoop(activeIndex);
    }, containerRef);
    return () => ctx.revert();
  }, [createLoop, activeIndex]);

  useEffect(() => {
    const timer = window.setTimeout(() => setRevealComplete(true), 1900);
    return () => window.clearTimeout(timer);
  }, [activeIndex]);

  const handleItemHover = (index: number) => {
    if (index === activeIndex) return;
    setRevealComplete(false);
    setActiveIndex(index);
  };

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "flex flex-col md:flex-row items-center justify-between min-h-[600px] w-full py-12 md:py-20 overflow-hidden transition-colors duration-500",
        "bg-white dark:bg-[#050505]", 
        className
      )}
    >
      
      {/* LEFT SIDE: HIGH CONTRAST MENU */}
      <div className="z-20 w-full md:w-1/2">
        <nav>
          <ul className="flex flex-col gap-10">
            {items.map((item, index) => (
              <li
                key={item.num}
                onMouseEnter={() => handleItemHover(index)}
                className="group cursor-pointer"
              >
                <button type="button" onClick={() => handleItemHover(index)} onFocus={() => handleItemHover(index)} aria-pressed={activeIndex === index} className="flex w-full items-start gap-6 text-left focus-visible:outline-2 focus-visible:outline-offset-8">
                  {/* Numbers: Increased visibility for non-hover state */}
                  <span className={cn(
                    "text-3xl font-bold transition-all duration-500 mt-2",
                    activeIndex === index 
                      ? "text-foreground scale-110" 
                      : "text-zinc-400 dark:text-zinc-600" 
                  )}>
                    {item.num}
                  </span>
                  
                  {/* Main Text: Enhanced visibility logic */}
                  <h2 className={cn(
                    "font-heading text-4xl md:text-5xl font-medium tracking-tighter leading-[0.85] transition-all duration-700",
                    activeIndex === index 
                      ? "text-zinc-950 dark:text-white opacity-100 translate-x-4" 
                      // INACTIVE STATE: Increased from Zinc-200 to Zinc-400 for Light Mode
                      // Increased stroke visibility for Dark Mode (#52525b is Zinc-600)
                      : "opacity-40 translate-x-0 " + 
                        "text-zinc-500 dark:text-transparent " + 
                        "dark:[text-stroke:1.5px_#52525b] dark:[-webkit-text-stroke:1.5px_#52525b]"
                  )}>
                    {item.name.split(' ')[0]}<br />
                    {item.name.split(' ')[1]}
                  </h2>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* RIGHT SIDE: SQUARE GRID (Sharp Squares) */}
      <div className="relative w-full md:w-1/2 flex justify-center items-center mt-16 md:mt-0">
        <div className="absolute w-[120%] h-[120%] bg-transparent blur-[120px] rounded-full transition-opacity duration-1000" />
        
        <svg role="img" aria-label={items[activeIndex].name} viewBox="0 0 500 500" className="w-[100%] max-w-[500px] h-auto z-10  dark:drop-shadow-[0_0_60px_rgba(0,0,0,0.8)]">
          <defs>
            <clipPath id="clip-original">
              {Array.from({ length: 5 }).map((_, i) => <rect key={i} className="path" x="0" y={i * 100} width="500" height="102" />)}
            </clipPath>

            <clipPath id="clip-hexagons">
              <rect className="path" x="20" y="20" width="200" height="280" rx="12" />
              <rect className="path" x="20" y="320" width="200" height="160" rx="12" />
              <rect className="path" x="240" y="20" width="240" height="140" rx="12" />
              <rect className="path" x="240" y="180" width="110" height="160" rx="12" />
              <rect className="path" x="370" y="180" width="110" height="160" rx="12" />
              <rect className="path" x="240" y="360" width="240" height="120" rx="12" />
            </clipPath>

            {/* Grid Squares with rx="4" as requested */}
            <clipPath id="clip-pixels">
              {Array.from({ length: 9 }).map((_, i) => (
                <rect
                  key={i}
                  className="path"
                  x={(i % 3) * 160 + 20}
                  y={Math.floor(i / 3) * 160 + 20}
                  width="140"
                  height="140"
                  rx="4" 
                />
              ))}
            </clipPath>
          </defs>

          <g ref={mainGroupRef} clipPath={revealComplete ? undefined : `url(#${items[activeIndex].clipId})`}>
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