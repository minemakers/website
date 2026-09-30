/**
 * Map and member files are found by convention, not listed in the Markdown:
 *
 *   src/assets/maps/<slug>/thumbnail.jpg   card image (required)
 *   src/assets/maps/<slug>/hero.jpg        page hero, also the first screenshot (optional)
 *   src/assets/maps/<slug>/*.jpg           any other image is a screenshot
 *   src/assets/maps/<slug>/zip/<name>.zip  one download per file, see downloadLabel(),
 *                                          served at /downloads/<slug>-<name>.zip
 *   src/assets/members/<slug>.jpg          team avatar (required)
 */
import fs from 'node:fs';
import path from 'node:path';
import type { ImageMetadata } from 'astro';

type ImageModule = { default: ImageMetadata };

const mapImages = import.meta.glob<ImageModule>('/src/assets/maps/*/*.{jpg,jpeg,png,webp}', { eager: true });
const memberImages = import.meta.glob<ImageModule>('/src/assets/members/*.{jpg,jpeg,png,webp}', { eager: true });

const baseName = (file: string) => path.basename(file).replace(/\.[^.]+$/, '');

export function getMapImages(slug: string) {
  const files = Object.entries(mapImages)
    .filter(([file]) => file.startsWith(`/src/assets/maps/${slug}/`))
    .sort(([a], [b]) => a.localeCompare(b));
  const find = (name: string) => files.find(([file]) => baseName(file) === name)?.[1].default;

  const thumbnail = find('thumbnail');
  if (!thumbnail) throw new Error(`Missing src/assets/maps/${slug}/thumbnail.jpg`);
  const hero = find('hero');
  const others = files.filter(([file]) => !['thumbnail', 'hero'].includes(baseName(file))).map(([, m]) => m.default);

  return {
    thumbnail,
    /** Page hero: hero.jpg, else the first screenshot, else the thumbnail. */
    hero: hero ?? others[0] ?? thumbnail,
    screenshots: hero ? [hero, ...others] : others,
  };
}

export function getAvatar(slug: string): ImageMetadata {
  const entry = Object.entries(memberImages).find(([file]) => baseName(file) === slug);
  if (!entry) throw new Error(`Missing src/assets/members/${slug}.jpg`);
  return entry[1].default;
}

/* ------------------------------------------------------------------ Downloads */

const zipDir = (slug: string) => path.resolve('src/assets/maps', slug, 'zip');

/** Sort key for a version like "1.17", "1.14-1.16" or "14w20b" (newest range end wins). */
function versionKey(version: string): number {
  const releases = [...version.matchAll(/1\.(\d+)(?:\.(\d+))?/g)];
  const last = releases.at(-1);
  if (last) return Number(last[1]) * 100 + Number(last[2] ?? 0);
  const snapshot = version.match(/^(\d{2})w\d{2}/);
  return snapshot ? Number(snapshot[1]) - 7 : 0; // 14wXX ≈ the 1.7/1.8 era
}

/**
 * File name → label:
 *   1.17.zip             → Minecraft 1.17
 *   1.14-1.16.zip        → Minecraft 1.14–1.16
 *   1.12 uncensored.zip  → Minecraft 1.12 (uncensored)
 *   resource-pack.zip    → Resource pack
 */
export function downloadLabel(file: string): string {
  const name = baseName(file);
  if (name === 'resource-pack') return 'Resource pack';
  const [version, ...variant] = name.split(' ');
  const label = `Minecraft ${version.replace('-', '–')}`;
  return variant.length ? `${label} (${variant.join(' ')})` : label;
}

export function getDownloads(slug: string) {
  const dir = zipDir(slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.zip'))
    .map((file) => {
      const isPack = baseName(file) === 'resource-pack';
      // e.g. "late-1.12-uncensored.zip": the map is in the name, no spaces.
      const publicName = `${slug}-${baseName(file).toLowerCase().replace(/\s+/g, '-')}.zip`;
      return {
        file,
        publicName,
        label: downloadLabel(file),
        href: `/downloads/${publicName}`,
        sortKey: isPack ? -1 : versionKey(baseName(file)),
      };
    })
    .sort((a, b) => b.sortKey - a.sortKey || a.file.localeCompare(b.file));
}

export const readDownload = (slug: string, file: string) => fs.readFileSync(path.join(zipDir(slug), file));
