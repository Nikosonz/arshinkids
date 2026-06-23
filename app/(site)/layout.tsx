import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// ISR: public pages are static + fast, but refresh every 5 min so direct DB
// seeds (via the Neon SQL console) show up without a redeploy. Admin edits also
// call revalidatePath() for instant updates. CLAUDE.md §1/§7.
export const revalidate = 300;

/** Public site shell — header + footer around every public page. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
