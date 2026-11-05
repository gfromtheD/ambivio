"use client";
import { useState } from "react";
import { Download, RefreshDouble } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { ProductIcon } from "@/components/ui/product-icon";

export function DownloadImageButton({ href, generationId = "resultado", compact = false }: { href: string; generationId?: string; compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "downloading" | "error">("idle");
  async function download() {
    setStatus("downloading");
    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error("download_failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      const extension = blob.type.split(";", 1)[0] === "image/jpeg" ? "jpg" : "png";
      anchor.download = `ambivio-${generationId}.${extension}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }
  return (
    <div className="grid gap-2">
      <Button type="button" size={compact ? "icon-xs" : "default"} variant={compact ? "ghost" : "default"} aria-label="Descargar imagen" onClick={() => void download()} disabled={status === "downloading"}>
        <ProductIcon icon={status === "downloading" ? RefreshDouble : Download} className={`size-4 ${status === "downloading" ? "animate-spin motion-reduce:animate-none" : ""}`} />
        {!compact && (status === "downloading" ? "Preparando descarga…" : "Descargar imagen")}
      </Button>
      {status === "error" && <p role="alert" className="text-xs text-destructive">No se pudo descargar la imagen. Recarga la página para obtener un enlace nuevo.</p>}
    </div>
  );
}
