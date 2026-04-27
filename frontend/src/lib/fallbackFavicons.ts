export const DEFAULT_FALLBACK_FAVICON_ID = 'bookmark-core';

export interface FallbackFavicon {
  id: string;
  name: string;
  accent: string;
  description: string;
  svg: string;
}

export const fallbackFavicons: FallbackFavicon[] = [
  {
    id: 'bookmark-core',
    name: 'Bookmark Core',
    accent: '#0a84ff',
    description: 'Safe default for saved websites.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#172033"/><path d="M20 16h24a4 4 0 0 1 4 4v31L32 42 16 51V20a4 4 0 0 1 4-4z" fill="#0a84ff"/><path d="M24 23h16M24 30h11" stroke="#eaf4ff" stroke-width="4" stroke-linecap="round"/></svg>',
  },
  {
    id: 'quiet-globe',
    name: 'Quiet Globe',
    accent: '#34c759',
    description: 'Generic web icon with a calm signal.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#14231a"/><circle cx="32" cy="32" r="19" fill="#34c759"/><path d="M13 32h38M32 13c7 7 7 31 0 38M32 13c-7 7-7 31 0 38" stroke="#092512" stroke-width="4" stroke-linecap="round"/></svg>',
  },
  {
    id: 'link-spark',
    name: 'Link Spark',
    accent: '#ffb340',
    description: 'For unknown links with energy.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#2a2112"/><path d="M41 19H29a3.5 3.5 0 0 0 0 7h3.55L21.5 37.05a3.54 3.54 0 0 0 5 5L37.55 31V34.5a3.5 3.5 0 0 0 7 0v-12A3.5 3.5 0 0 0 41 19z" fill="#ffb340"/><path d="M19 45h26" stroke="#fff1d8" stroke-width="5" stroke-linecap="round"/></svg>',
  },
  {
    id: 'soft-folder',
    name: 'Soft Folder',
    accent: '#ffcc00',
    description: 'Good for uncategorized local-like items.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#2b250f"/><path d="M12 24a6 6 0 0 1 6-6h11l5 6h12a6 6 0 0 1 6 6v18H12V24z" fill="#ffd43b"/><path d="M12 30h40v16a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V30z" fill="#ffb340"/></svg>',
  },
  {
    id: 'compass-dot',
    name: 'Compass Dot',
    accent: '#5ac8fa',
    description: 'Navigation metaphor for web shortcuts.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#10242c"/><circle cx="32" cy="32" r="20" fill="#5ac8fa"/><path d="M39 18l-5 17-16 11 5-17 16-11z" fill="#083241"/><circle cx="32" cy="32" r="4" fill="#e9fbff"/></svg>',
  },
  {
    id: 'stacked-pages',
    name: 'Stacked Pages',
    accent: '#af52de',
    description: 'Feels like collected resources.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#24142d"/><rect x="18" y="14" width="30" height="38" rx="6" fill="#6d2e8f"/><rect x="14" y="18" width="30" height="38" rx="6" fill="#af52de"/><path d="M22 29h14M22 37h10" stroke="#f8e7ff" stroke-width="4" stroke-linecap="round"/></svg>',
  },
  {
    id: 'pinboard',
    name: 'Pinboard',
    accent: '#ff2d55',
    description: 'Bookmark as pinned reference.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#2b1218"/><path d="M22 16h20l-4 17 9 9-15 3-15-3 9-9-4-17z" fill="#ff2d55"/><path d="M32 44v9" stroke="#ffd9e1" stroke-width="5" stroke-linecap="round"/></svg>',
  },
  {
    id: 'tiny-window',
    name: 'Tiny Window',
    accent: '#8e8e93',
    description: 'Neutral app/window fallback.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#202124"/><rect x="14" y="18" width="36" height="30" rx="6" fill="#8e8e93"/><circle cx="21" cy="25" r="2.5" fill="#ff453a"/><circle cx="29" cy="25" r="2.5" fill="#ffcc00"/><circle cx="37" cy="25" r="2.5" fill="#34c759"/><path d="M20 35h24" stroke="#f2f2f7" stroke-width="4" stroke-linecap="round"/></svg>',
  },
  {
    id: 'north-star',
    name: 'North Star',
    accent: '#ffffff',
    description: 'Minimal, clear, high-contrast.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#1f2023"/><path d="M32 10l6 16 16 6-16 6-6 16-6-16-16-6 16-6 6-16z" fill="#ffffff"/><circle cx="32" cy="32" r="5" fill="#0a84ff"/></svg>',
  },
  {
    id: 'collector-grid',
    name: 'Collector Grid',
    accent: '#00c7be',
    description: 'Collection system identity.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#112725"/><g fill="#00c7be"><rect x="16" y="16" width="13" height="13" rx="4"/><rect x="35" y="16" width="13" height="13" rx="4"/><rect x="16" y="35" width="13" height="13" rx="4"/><rect x="35" y="35" width="13" height="13" rx="4"/></g></svg>',
  },
  {
    id: 'paper-plane',
    name: 'Paper Plane',
    accent: '#64d2ff',
    description: 'Open and go quickly.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#10212d"/><path d="M12 30l40-16-16 40-7-17-17-7z" fill="#64d2ff"/><path d="M29 37l23-23" stroke="#073246" stroke-width="4" stroke-linecap="round"/></svg>',
  },
  {
    id: 'command-tile',
    name: 'Command Tile',
    accent: '#30d158',
    description: 'Useful for tool/developer links.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#121f16"/><rect x="14" y="18" width="36" height="28" rx="7" fill="#30d158"/><path d="M22 28l6 4-6 4M33 38h10" stroke="#082312" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    id: 'archive-box',
    name: 'Archive Box',
    accent: '#ac8e68',
    description: 'Warm, quiet fallback for saved items.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#2a2119"/><path d="M15 24h34v24a6 6 0 0 1-6 6H21a6 6 0 0 1-6-6V24z" fill="#ac8e68"/><path d="M12 17h40v11H12z" fill="#d2ad7f"/><path d="M26 34h12" stroke="#fff3df" stroke-width="4" stroke-linecap="round"/></svg>',
  },
  {
    id: 'pulse-bolt',
    name: 'Pulse Bolt',
    accent: '#ff9500',
    description: 'Clear signal when favicon is missing.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#291b0b"/><path d="M36 8L16 35h15l-3 21 20-28H34l2-20z" fill="#ff9500"/></svg>',
  },
  {
    id: 'layered-ring',
    name: 'Layered Ring',
    accent: '#5856d6',
    description: 'Abstract, polished, app-like.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#171737"/><circle cx="28" cy="28" r="15" fill="#5856d6"/><circle cx="38" cy="36" r="15" fill="#7d7aff" fill-opacity=".72"/><circle cx="33" cy="32" r="8" fill="#f3f2ff"/></svg>',
  },
  {
    id: 'search-lens',
    name: 'Search Lens',
    accent: '#40c8e0',
    description: 'Good for unknown web destinations.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#11262b"/><circle cx="29" cy="29" r="14" fill="none" stroke="#40c8e0" stroke-width="8"/><path d="M40 40l10 10" stroke="#e8fbff" stroke-width="7" stroke-linecap="round"/></svg>',
  },
  {
    id: 'route-flag',
    name: 'Route Flag',
    accent: '#ff6b6b',
    description: 'Shortcut destination marker.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#2b1515"/><path d="M20 52V13" stroke="#ffdede" stroke-width="6" stroke-linecap="round"/><path d="M23 14h25l-6 10 6 10H23V14z" fill="#ff6b6b"/></svg>',
  },
  {
    id: 'clean-w',
    name: 'Clean W',
    accent: '#0a84ff',
    description: 'Brand-leaning Web Collector fallback.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#121f31"/><path d="M14 20l8 26 10-18 10 18 8-26" fill="none" stroke="#0a84ff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    id: 'gem-link',
    name: 'Gem Link',
    accent: '#bf5af2',
    description: 'Premium-looking unknown site icon.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#25142f"/><path d="M20 14h24l10 14-22 24-22-24 10-14z" fill="#bf5af2"/><path d="M20 14l12 38 12-38M10 28h44" stroke="#f7e6ff" stroke-width="3" stroke-linejoin="round"/></svg>',
  },
  {
    id: 'quiet-initial',
    name: 'Quiet Initial',
    accent: '#a1a1aa',
    description: 'Simple letter-style placeholder.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#242529"/><circle cx="32" cy="32" r="20" fill="#3a3b40"/><path d="M21 23l5 18 6-12 6 12 5-18" fill="none" stroke="#f5f5f7" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
];

const dataUrlCache = new Map<string, string>();

export function getFallbackFavicon(id?: string | null): FallbackFavicon {
  return (
    fallbackFavicons.find((favicon) => favicon.id === id) ||
    fallbackFavicons.find((favicon) => favicon.id === DEFAULT_FALLBACK_FAVICON_ID) ||
    fallbackFavicons[0]
  );
}

export function getFallbackFaviconDataUrl(id?: string | null): string {
  const favicon = getFallbackFavicon(id);
  const cached = dataUrlCache.get(favicon.id);
  if (cached) return cached;

  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(favicon.svg)}`;
  dataUrlCache.set(favicon.id, dataUrl);
  return dataUrl;
}

export function getFallbackFaviconIdFromDataUrl(dataUrl?: string | null): string | null {
  if (!dataUrl?.startsWith('data:image/svg+xml')) {
    return null;
  }

  return (
    fallbackFavicons.find((favicon) => getFallbackFaviconDataUrl(favicon.id) === dataUrl)?.id ||
    null
  );
}

export function normalizeFallbackFaviconDataUrl(dataUrl: unknown): string | undefined {
  if (typeof dataUrl !== 'string') {
    return undefined;
  }

  return getFallbackFaviconIdFromDataUrl(dataUrl) ? dataUrl : undefined;
}
