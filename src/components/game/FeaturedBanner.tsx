'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, ChevronLeft, ChevronRight, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Game } from '@/types/game';

interface FeaturedBannerProps {
  games: Game[];
}

export function FeaturedBanner({ games }: FeaturedBannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % games.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [games.length]);

  const game = games[current];
  if (!game) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/5">
      <div className="relative h-[280px] sm:h-[360px] lg:h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={game.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 via-neon-purple/30 to-neon-pink/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-gaming-dark via-gaming-dark/60 to-transparent" />
            
            {/* Decorative elements */}
            <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-neon-blue/10 blur-3xl" />
            <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-neon-purple/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Gamepad2 className="h-48 w-48 text-white/[0.03]" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
                  Featured
                </Badge>
                <Badge variant="outline" className="border-white/20 capitalize">
                  {game.category.replace('-', ' ')}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-yellow-400">
                  <Star className="h-3.5 w-3.5" fill="currentColor" />
                  {game.rating}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                {game.title}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-lg mb-6 line-clamp-2">
                {game.description}
              </p>

              <div className="flex items-center gap-3">
                <Link href={`/games/${game.slug}`}>
                  <Button className="bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 text-white gap-2 px-6 h-11 rounded-xl shadow-lg shadow-neon-blue/25">
                    <Play className="h-4 w-4" fill="white" />
                    Play Now
                  </Button>
                </Link>
                <Link href={`/games/${game.slug}`}>
                  <Button variant="outline" className="border-white/20 hover:bg-white/10 h-11 rounded-xl">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="absolute bottom-6 right-6 sm:right-8 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20"
            onClick={() => setCurrent((prev) => (prev - 1 + games.length) % games.length)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-1.5">
            {games.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-neon-blue' : 'w-1.5 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20"
            onClick={() => setCurrent((prev) => (prev + 1) % games.length)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
