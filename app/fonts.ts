import { Vazirmatn } from "next/font/google";

/**
 * Self-hosted Vazirmatn (Persian + Latin). next/font fetches the files at
 * BUILD time on Vercel (not from the local Iran machine), then self-hosts them
 * — no render-blocking Google Fonts @import, no runtime Google fetch.
 * CLAUDE.md §2.
 */
export const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});
