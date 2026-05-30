import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories, getCategoryBySlug } from '@/data/categories';
import { getGamesByCategory } from '@/data/games';
import { GameGrid } from '@/components/game/GameGrid';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return { title: 'Category Not Found' };
  return {
    title: `${cat.name} Games`,
    description: `Play free ${cat.name} games online. ${cat.description}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const categoryGames = getGamesByCategory(category);

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1 text-sm text-muted-foreground">
          <Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link>
          <span>/</span>
          <span className="text-foreground">{cat.name}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">{cat.name} Games</h1>
        <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
        <p className="text-xs text-neon-blue mt-2">{categoryGames.length} games</p>
      </div>
      <GameGrid games={categoryGames} columns={5} />
    </div>
  );
}
