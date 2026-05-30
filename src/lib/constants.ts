export const SITE_NAME = 'ZyBytee Games';
export const SITE_DESCRIPTION = 'Play free online games at ZyBytee Games. Arcade, puzzle, racing, action, and more!';
export const SITE_URL = 'https://games.zybytee.in';
export const SITE_LOGO = '/images/logo.svg';

export const NAV_LINKS = [
  { href: '/', label: 'Home', icon: 'Home' },
  { href: '/games', label: 'All Games', icon: 'Gamepad2' },
  { href: '/trending', label: 'Trending', icon: 'TrendingUp' },
  { href: '/new', label: 'New', icon: 'Sparkles' },
  { href: '/categories', label: 'Categories', icon: 'LayoutGrid' },
  { href: '/leaderboard', label: 'Leaderboard', icon: 'Trophy' },
] as const;

export const FOOTER_LINKS = {
  games: [
    { href: '/games', label: 'All Games' },
    { href: '/trending', label: 'Trending' },
    { href: '/new', label: 'New Games' },
    { href: '/categories', label: 'Categories' },
  ],
  account: [
    { href: '/profile', label: 'Profile' },
    { href: '/favorites', label: 'Favorites' },
    { href: '/recently-played', label: 'Recently Played' },
    { href: '/settings', label: 'Settings' },
  ],
  company: [
    { href: '#', label: 'About Us' },
    { href: '#', label: 'Contact' },
    { href: '#', label: 'Privacy Policy' },
    { href: '#', label: 'Terms of Service' },
  ],
} as const;

export const ITEMS_PER_PAGE = 24;
