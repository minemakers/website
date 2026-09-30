import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Content files are named "<number>-<slug>.md". The number sets the order and is stripped from the id,
 * so "21-shulker-rush-2.md" becomes the entry "shulker-rush-2" (its URL and asset folder).
 */
const numbered = (base: string) =>
  glob({
    pattern: '**/*.md',
    base,
    generateId: ({ entry }) => entry.replace(/\.md$/, '').replace(/^\d+-/, ''),
  });

/**
 * PvP: you win by fighting other players (weapons, bows, knockback).
 * Minigame: you win without fighting directly (mining, running, solving, racing, dice). Never combined with PvP.
 * Team: played in teams. A multiplayer map without it is every player for themselves.
 */
export const TAGS = ['pvp', 'minigame', 'team', 'parkour', 'puzzle', 'adventure', 'horror'] as const;

const maps = defineCollection({
  loader: numbered('./src/content/maps'),
  schema: z.object({
      title: z.string(),
      mode: z.enum(['singleplayer', 'multiplayer']),
      tags: z.array(z.enum(TAGS)).default([]),
      /** One plain sentence: shown on cards and as the intro of the map page. */
      summary: z.string(),
      trailer: z.string().optional().describe('YouTube video id'),
      /** Maps with a CurseForge page are the ones still maintained. */
      curseforge: z.url().optional(),
      github: z.url().optional(),
      sequelOf: reference('maps').optional(),
    }),
});

const members = defineCollection({
  loader: numbered('./src/content/members'),
  schema: z.object({
      name: z.string(),
    }),
});

export const collections = { maps, members };
