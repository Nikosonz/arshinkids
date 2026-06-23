import {
  Baby,
  Blocks,
  Puzzle,
  GraduationCap,
  Palette,
  Music,
  BookOpen,
  Sparkles,
  Sun,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";

/** Map a stored icon name (Program.icon) to a Lucide component. */
const ICONS: Record<string, LucideIcon> = {
  baby: Baby,
  blocks: Blocks,
  puzzle: Puzzle,
  "graduation-cap": GraduationCap,
  palette: Palette,
  music: Music,
  book: BookOpen,
  sparkles: Sparkles,
  sun: Sun,
  heart: HeartHandshake,
};

export function ProgramIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Icon = (name && ICONS[name]) || Sparkles;
  return <Icon className={className} aria-hidden />;
}

/** Map a stored color token name (e.g. "fun-green") to its CSS custom property. */
export function colorVar(token?: string | null): string {
  return `var(--${token ?? "accent"})`;
}
