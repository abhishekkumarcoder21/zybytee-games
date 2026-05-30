'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Joystick, Car, Puzzle, Swords, Compass, Trophy,
  Users, GraduationCap, Brain, Dice5,
} from 'lucide-react';
import type { Category } from '@/types/game';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Joystick, Car, Puzzle, Swords, Compass, Trophy,
  Users, GraduationCap, Brain, Dice5,
};

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Joystick;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/categories/${category.slug}`}>
        <div className="group relative overflow-hidden rounded-xl border border-white/5 bg-card p-5 game-card-hover">
          <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} mb-4 shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>

          <h3 className="font-semibold mb-1 group-hover:text-neon-blue transition-colors">
            {category.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {category.description}
          </p>
          <span className="text-xs font-medium text-neon-blue">
            {category.gameCount} games
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
