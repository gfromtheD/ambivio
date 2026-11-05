"use client";

import Link from "next/link";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useMemo, useRef, useState } from "react";
import { Clock, ControlSlider, Filter, FrameAlt, OpenNewWindow, Search, Xmark } from "iconoir-react";

import { DownloadImageButton } from "@/components/generations/download-image-button";
import { BeforeAfterSlider } from "@/components/generations/before-after-slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ProductIcon } from "@/components/ui/product-icon";
import { GENERATION_STATUS_LABELS, ROOM_TYPE_LABELS, type GenerationStatus, type RoomType } from "@/lib/domain";
import type { AllGenerationsItem } from "@/services/generations";

// Images are private, short-lived signed URLs and cannot use a static next/image remote host.
/* eslint-disable @next/next/no-img-element */

function statusVariant(status: string) { if (status === "completed") return "default" as const; if (status === "failed") return "destructive" as const; if (status === "processing") return "outline" as const; return "secondary" as const; }
function formatDate(value: string) { return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value)); }

export function GenerationsHistoryView({ initialGenerations }: { initialGenerations: AllGenerationsItem[] }) {
  const comparisonTrigger = useRef<HTMLButtonElement | null>(null);
  const [query, setQuery] = useState(""); const [status, setStatus] = useState("all"); const [roomType, setRoomType] = useState("all"); const [comparison, setComparison] = useState<AllGenerationsItem | null>(null);
  const roomTypes = useMemo(() => Array.from(new Set(initialGenerations.map((item) => item.roomType).filter(Boolean))), [initialGenerations]);
  const filtered = useMemo(() => initialGenerations.filter((item) => { const haystack = `${item.propertyTitle} ${item.roomType} ${item.styleName}`.toLowerCase(); return (!query.trim() || haystack.includes(query.trim().toLowerCase())) && (status === "all" || item.status === status) && (roomType === "all" || item.roomType === roomType); }), [initialGenerations, query, roomType, status]);
  const hasFilters = Boolean(query) || status !== "all" || roomType !== "all";
  const clear = () => { setQuery(""); setStatus("all"); setRoomType("all"); };
  return <div className="space-y-8">
    <section className="border-y border-border py-6"><div className="grid gap-3 lg:grid-cols-[minmax(16rem,1fr)_auto] lg:items-center"><div className="relative"><ProductIcon icon={Search} className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Buscar generaciones" placeholder="Buscar propiedad, estancia o estilo" value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 pl-9 pr-10" />{query && <button type="button" aria-label="Limpiar búsqueda" onClick={() => setQuery("")} className="absolute right-1 top-1/2 grid size-8 -translate-y-1/2 place-items-center text-muted-foreground transition-colors duration-[var(--motion-duration-control)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"><ProductIcon icon={Xmark} className="size-4" /></button>}</div><div className="flex flex-wrap gap-2"><select aria-label="Filtrar por estado" value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none transition-[border-color,box-shadow] duration-[var(--motion-duration-control)] focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"><option value="all">Todos los estados</option>{["completed","processing","pending","failed","cancelled"].map((value) => <option key={value} value={value}>{GENERATION_STATUS_LABELS[value as GenerationStatus]}</option>)}</select><select aria-label="Filtrar por estancia" value={roomType} onChange={(event) => setRoomType(event.target.value)} className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none transition-[border-color,box-shadow] duration-[var(--motion-duration-control)] focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"><option value="all">Todas las estancias</option>{roomTypes.map((type) => <option key={type} value={type}>{ROOM_TYPE_LABELS[type as RoomType] ?? type}</option>)}</select>{hasFilters && <Button type="button" variant="ghost" size="sm" onClick={clear}><ProductIcon icon={Filter} className="size-3.5" />Limpiar</Button>}</div></div></section>
    <p aria-live="polite" className="text-xs text-muted-foreground">{filtered.length} de {initialGenerations.length} generaciones</p>
    {filtered.length === 0 ? <EmptyState icon={FrameAlt} title={hasFilters ? "No hay resultados para estos filtros" : "Aún no hay generaciones"} description={hasFilters ? "Prueba a cambiar los filtros para volver a ver el archivo de trabajo." : "Las propuestas visuales de tus habitaciones aparecerán aquí."} action={hasFilters ? <Button type="button" variant="outline" size="sm" onClick={clear}>Limpiar filtros</Button> : <Button asChild size="sm"><Link href="/properties">Ir a propiedades</Link></Button>} /> : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{filtered.map((item) => <article key={item.id} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">{item.outputImageUrl && item.originalImageUrl ? <div className="grid size-full grid-cols-2"><img src={item.originalImageUrl} alt="Fotografía original" className="size-full object-cover" /><img src={item.outputImageUrl} alt={`Resultado ${item.styleName}`} className="size-full object-cover" /></div> : item.outputImageUrl ? <img src={item.outputImageUrl} alt={`Resultado ${item.styleName}`} className="size-full object-cover" /> : item.originalImageUrl ? <img src={item.originalImageUrl} alt="Fotografía original" className="size-full object-cover opacity-70" /> : <div className="grid size-full place-items-center text-xs text-muted-foreground">Sin vista previa</div>}<div className="absolute left-3 top-3"><Badge variant={statusVariant(item.status)}>{GENERATION_STATUS_LABELS[item.status as GenerationStatus] ?? item.status}</Badge></div>{item.outputImageUrl && item.originalImageUrl && <span className="absolute bottom-2 left-2 border border-white/40 bg-black/65 px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-[0.12em] text-white">Original · Resultado</span>}</div>
      <div className="flex flex-1 flex-col pt-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><Link href={`/properties/${item.propertyId}`} className="block truncate text-sm font-medium transition-colors hover:text-muted-foreground">{item.propertyTitle}</Link><Link href={`/properties/${item.propertyId}/rooms/${item.roomId}`} className="mt-1 block text-sm text-muted-foreground hover:text-foreground">{ROOM_TYPE_LABELS[item.roomType as RoomType] ?? item.roomType}</Link></div><Badge variant="secondary" className="shrink-0">{item.styleName}</Badge></div><p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground"><ProductIcon icon={Clock} className="size-3.5" />{formatDate(item.createdAt)}</p>{item.status === "failed" && <p className="mt-3 text-sm text-muted-foreground">La generación no pudo completarse.</p>}<div className="mt-5 flex items-center justify-between border-t border-border pt-3">{item.status === "completed" && item.outputImageUrl && item.originalImageUrl ? <Button type="button" variant="ghost" size="sm" onClick={(event) => { comparisonTrigger.current = event.currentTarget; setComparison(item); }}><ProductIcon icon={ControlSlider} className="size-3.5" />Comparar</Button> : <span />}{item.status === "completed" && item.outputImageUrl ? <DownloadImageButton href={item.outputImageUrl} generationId={item.id} compact /> : <Link href={`/properties/${item.propertyId}/rooms/${item.roomId}`} aria-label="Abrir estancia"><ProductIcon icon={OpenNewWindow} className="size-4 text-muted-foreground" /></Link>}</div></div>
    </article>)}</div>}
    <DialogPrimitive.Root open={Boolean(comparison)} onOpenChange={(open) => { if (!open) setComparison(null); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm" />
        <DialogPrimitive.Content onCloseAutoFocus={(event) => { event.preventDefault(); comparisonTrigger.current?.focus(); }} className="fixed inset-3 z-50 flex flex-col rounded-2xl border border-border bg-background p-5 shadow-ambivio outline-none sm:inset-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
            <div className="min-w-0">
              <DialogPrimitive.Title className="font-heading text-xl font-medium">Antes y después</DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-2 text-sm text-muted-foreground">{comparison?.propertyTitle} · {comparison?.styleName}</DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close asChild><Button type="button" variant="outline" size="sm"><ProductIcon icon={Xmark} className="size-4" />Cerrar</Button></DialogPrimitive.Close>
          </div>
          {comparison?.outputImageUrl && comparison.originalImageUrl ? <div className="min-h-0 flex-1 py-5"><BeforeAfterSlider originalUrl={comparison.originalImageUrl} stagedUrl={comparison.outputImageUrl} title={comparison.propertyTitle + " · " + comparison.styleName} /></div> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  </div>;
}
