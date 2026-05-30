import type { Game } from '@/types/game';
import { GameCard } from './GameCard';

interface GameGridProps {
  games: Game[];
  columns?: 2 | 3 | 4 | 5 | 6;
}

export function GameGrid({ games, columns = 4 }: GameGridProps) {
  const colsClass: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
  };

  return (
    <div className={`grid ${colsClass[columns]} gap-4`}>
      {games.map((game, index) => (
        <GameCard key={game.id} game={game} index={index} />
      ))}
    </div>
  );
}
