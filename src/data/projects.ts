export interface Project {
  slug: string;
  name: string;
  accent: string; // highlighted part of the name
  type: string;
  status: string;
  live: boolean;
  line: string;
  thumb: string;
}

export const projects: Project[] = [
  {
    slug: 'eventgem',
    name: 'Event',
    accent: 'Gem',
    type: 'Hero project · Event ticketing',
    status: 'Live product',
    live: true,
    line: 'The festive-season bestie for Indians overseas. Garba nights, Diwali celebrations and concerts, all in one place.',
    thumb: '/images/thumb-eventgem.webp',
  },
  {
    slug: 'food-rescue',
    name: 'Food ',
    accent: 'Rescue',
    type: 'Concept · Swiggy feature',
    status: 'Concept',
    live: false,
    line: 'Late-night cravings, but make it sustainable. Fresh, unsold meals at up to 70% off, 9–11 PM only.',
    thumb: '/images/thumb-foodrescue.webp',
  },
  {
    slug: 'dear-wallet',
    name: 'Dear ',
    accent: 'Wallet',
    type: 'Design + build · Self-initiated',
    status: 'Live app',
    live: true,
    line: '3 paper sketches to a live app my household actually uses. The secret sauce? Deleting stuff.',
    thumb: '/images/thumb-dearwallet.webp',
  },
  {
    slug: 'logrite',
    name: 'Log',
    accent: 'Rite',
    type: 'Website design · Framer',
    status: 'Live client site',
    live: true,
    line: "AI governance for AI tools, aka the rulebook your AI agents can't ghost.",
    thumb: '/images/thumb-logrite.webp',
  },
];

export function nextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
