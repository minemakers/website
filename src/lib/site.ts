export const SITE = {
  name: 'MineMakers',
  title: 'MineMakers Team - Minecraft maps',
  description:
    'MineMakers made Minecraft minigames and adventure maps. Every map is still available to download, and the ones on CurseForge are kept up to date.',
  nav: [
    { label: 'Maps', href: '/maps/' },
    { label: 'Team', href: '/team/' },
  ],
  socials: [
    { label: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/@minemakers' },
    { label: 'Twitch', icon: 'twitch', href: 'https://www.twitch.tv/minemakers' },
    { label: 'GitHub', icon: 'github', href: 'https://github.com/minemakers' },
  ],
} as const;
