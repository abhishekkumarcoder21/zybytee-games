import type { Metadata } from 'next';
import { categories } from '@/data/categories';
import { CategoryCard } from '@/components/category/CategoryCard';
import { LayoutGrid } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse games by category. Arcade, Racing, Puzzle, Action, Adventure, Sports, and more!',
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple">
          <LayoutGrid className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">Browse games by category</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <CategoryCard key={cat.slug} category={cat} index={i} />
        ))}
      </div>
    </div>
  );
}
