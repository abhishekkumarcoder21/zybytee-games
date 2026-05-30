import type { MetadataRoute } from 'next';
import { games } from '@/data/games';
import { categories } from '@/data/categories';

const BASE_URL = 'https://games.zybytee.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/games`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/trending`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/new`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/leaderboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ];

  const gameRoutes: MetadataRoute.Sitemap = games.map((game) => ({
    url: `${BASE_URL}/games/${game.slug}`,
    lastModified: new Date(game.lastUpdated),
    changeFrequency: 'weekly' as const,
    priority: game.featured ? 0.9 : 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...gameRoutes, ...categoryRoutes];
}
