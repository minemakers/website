import { getCollection, type CollectionEntry } from 'astro:content';

export type MapEntry = CollectionEntry<'maps'>;

/** The number prefix of a content file ("21-shulker-rush-2.md" → 21). Maps: higher is newer. */
export const orderOf = (entry: { filePath?: string }) => Number(entry.filePath?.match(/(\d+)-[^/]+$/)?.[1] ?? 0);

export async function getMaps() {
  const all = (await getCollection('maps')).sort((a, b) => orderOf(b) - orderOf(a));
  return {
    all,
    /** Maps with a CurseForge page: the ones still maintained. */
    maintained: all.filter((m) => m.data.curseforge),
  };
}

export const TAG_LABELS: Record<string, string> = {
  singleplayer: 'Singleplayer',
  multiplayer: 'Multiplayer',
  minigame: 'Minigame',
  pvp: 'PvP',
  team: 'Team',
  parkour: 'Parkour',
  puzzle: 'Puzzle',
  adventure: 'Adventure',
  horror: 'Horror',
};

/** Player mode first, then genres: the tags shown on cards and used by the maps filter. */
export const tagsOf = (map: MapEntry): string[] => [map.data.mode, ...map.data.tags];

/** Plain-text summary for cards and meta descriptions. */
export const blurb = (map: MapEntry): string => map.data.summary;
