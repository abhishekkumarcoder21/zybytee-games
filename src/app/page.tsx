import { FeaturedBanner } from '@/components/game/FeaturedBanner';
import { GameCarousel } from '@/components/game/GameCarousel';
import { GameGrid } from '@/components/game/GameGrid';
import { CategoryCard } from '@/components/category/CategoryCard';
import { getFeaturedGames, getTrendingGames, getNewGames, getPopularGames, getGamesByCategory } from '@/data/games';
import { categories } from '@/data/categories';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

export default function HomePage() {
  const featured = getFeaturedGames().slice(0, 5);
  const trending = getTrendingGames();
  const newGames = getNewGames();
  const popular = getPopularGames(12);

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6 space-y-10">
      {/* Featured Banner */}
      <FeaturedBanner games={featured} />

      {/* Trending Games Carousel */}
      <GameCarousel
        title="🔥 Trending Now"
        games={trending}
        viewAllHref="/trending"
      />

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-neon-blue" />
            Categories
          </h2>
          <Link href="/categories" className="text-sm text-neon-blue hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.slug} category={cat} index={i} />
          ))}
        </div>
      </section>

      {/* Popular Games */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Most Popular
          </h2>
          <Link href="/games" className="text-sm text-neon-blue hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <GameGrid games={popular} columns={6} />
      </section>

      {/* New Games */}
      {newGames.length > 0 && (
        <GameCarousel
          title="✨ Recently Added"
          games={newGames}
          viewAllHref="/new"
        />
      )}

      {/* Category Sections — show top 3 categories with games */}
      {categories.slice(0, 3).map((cat) => {
        const catGames = getGamesByCategory(cat.slug).slice(0, 6);
        if (catGames.length === 0) return null;
        return (
          <GameCarousel
            key={cat.slug}
            title={cat.name}
            games={catGames}
            viewAllHref={`/categories/${cat.slug}`}
          />
        );
      })}
    </div>
  );
}
