/**
 * Aparat helpers. Lessons are hosted on Aparat; the CMS stores only the video
 * "hash" parsed from a pasted link, and we build the embed URL at render time.
 *
 * Accepted inputs for parseAparatHash():
 *   https://www.aparat.com/v/AbC12
 *   https://aparat.com/v/AbC12/
 *   https://www.aparat.com/video/video/embed/videohash/AbC12/vt/frame
 *   a full <iframe …/videohash/AbC12/…> embed snippet
 *   a bare hash: AbC12
 */

/** Extract the Aparat video hash from a pasted URL / embed code, or null. */
export function parseAparatHash(input: string): string | null {
  const s = input.trim();
  if (!s) return null;

  // embed form: …/videohash/HASH/…
  const embed = s.match(/videohash\/([a-zA-Z0-9]+)/i);
  if (embed) return embed[1];

  // watch form: aparat.com/v/HASH  (also tolerates aparat.com/HASH)
  const watch = s.match(/aparat\.com\/(?:v\/)?([a-zA-Z0-9]+)/i);
  if (watch) return watch[1];

  // bare hash
  if (/^[a-zA-Z0-9]{4,}$/.test(s)) return s;

  return null;
}

/** Iframe src for the Aparat player. */
export function aparatEmbedUrl(hash: string): string {
  return `https://www.aparat.com/video/video/embed/videohash/${hash}/vt/frame`;
}

/** Public watch page on aparat.com. */
export function aparatWatchUrl(hash: string): string {
  return `https://www.aparat.com/v/${hash}`;
}
