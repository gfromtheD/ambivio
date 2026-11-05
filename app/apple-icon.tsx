import { ImageResponse } from "next/og";
import { AMBIVIO_ICON_PATH } from "@/lib/brand-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <svg viewBox="0 0 64 64" height="180" width="180" fill="none">
      <rect width="64" height="64" rx="14" fill="#fff" />
      <path d={AMBIVIO_ICON_PATH} fill="#1c1c1c" />
    </svg>,
    size,
  );
}
