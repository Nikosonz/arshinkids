import { ImageResponse } from "next/og";
import { business } from "@/lib/business";

// Default branded 1200×630 social preview for every page. CLAUDE.md §8.
// Text is Latin/brand only — ImageResponse can't render Persian glyphs without
// bundling a font, so we avoid Farsi here.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = business.nameLatin;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f97a1f 0%, #f7c64b 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 160,
            height: 160,
            borderRadius: 40,
            background: "rgba(255,255,255,0.2)",
            fontSize: 90,
          }}
        >
          🧸
        </div>
        <div style={{ marginTop: 40, fontSize: 84, fontWeight: 800 }}>
          {business.nameLatin}
        </div>
        <div style={{ marginTop: 12, fontSize: 36, opacity: 0.95 }}>
          Kindergarten & Preschool
        </div>
      </div>
    ),
    size,
  );
}
