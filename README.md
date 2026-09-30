# minemakers.net

The MineMakers website, a static [Astro](https://astro.build) site.

```sh
npm install
npm run dev     # http://localhost:4321
npm run build   # type-check + build to dist/
```

## Adding a map

1. Create `src/content/maps/<number>-<slug>.md`, e.g. `22-my-new-map.md`. The slug is the URL
   (`/<slug>/`) and the number sets the order: use the next number so the newest map comes first.

   ```yaml
   ---
   title: "Makers Wars II"
   mode: "multiplayer"     # singleplayer | multiplayer
   tags: ["pvp", "team"]   # pvp | minigame | team | parkour | puzzle | adventure | horror
   summary: "One plain sentence for the card and the page intro."
   trailer: "aqxAcekj5cw"  # YouTube id (optional)
   curseforge: "https://www.curseforge.com/minecraft/worlds/makers-wars-2"  # optional, marks the map as maintained
   github: "https://github.com/minemakers/makers-wars"                      # optional
   sequelOf: "makers-wars"                                                   # optional
   ---

   Description in Markdown.
   ```

2. Put its files in `src/assets/maps/<slug>/`. They're picked up automatically:

   | File | Used as |
   |---|---|
   | `thumbnail.jpg` | card image (required) |
   | `hero.jpg` | page hero and first screenshot |
   | any other image | screenshot |
   | `zip/1.17.zip` | download "Minecraft 1.17" |
   | `zip/1.14-1.16.zip` | download "Minecraft 1.14–1.16" |
   | `zip/1.12 uncensored.zip` | download "Minecraft 1.12 (uncensored)" |
   | `zip/resource-pack.zip` | download "Resource pack" |

   ZIPs are served as `/downloads/<slug>-<file>.zip`, e.g. `/downloads/late-1.12-uncensored.zip`.

**Tags:** PvP means you win by fighting other players. Minigame means you win without fighting
directly (never both). Team means it's played in teams.

## Team

`src/content/members/<number>-<slug>.md` (name and bio; the number sets the order) and the avatar at
`src/assets/members/<slug>.jpg`.
