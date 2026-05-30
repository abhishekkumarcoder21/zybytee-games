import { Trophy, Medal, Award } from 'lucide-react';
import type { LeaderboardEntry } from '@/types/game';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  title?: string;
}

const rankColors: Record<number, string> = {
  1: 'text-yellow-400',
  2: 'text-gray-300',
  3: 'text-amber-600',
};

const rankIcons: Record<number, React.ComponentType<{ className?: string }>> = {
  1: Trophy,
  2: Medal,
  3: Award,
};

export function LeaderboardTable({ entries, title = 'Leaderboard' }: LeaderboardTableProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5">
        <h3 className="font-semibold flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-400" />
          {title}
        </h3>
      </div>
      <div className="divide-y divide-white/5">
        {entries.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            No entries yet. Be the first to play!
          </div>
        ) : (
          entries.map((entry) => {
            const RankIcon = rankIcons[entry.rank];
            return (
              <div
                key={entry.id}
                className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className={`w-8 text-center font-bold ${rankColors[entry.rank] || 'text-muted-foreground'}`}>
                  {RankIcon ? (
                    <RankIcon className="h-5 w-5 mx-auto" />
                  ) : (
                    <span className="text-sm">#{entry.rank}</span>
                  )}
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-neon-blue/30 to-neon-purple/30 text-xs font-bold shrink-0">
                  {entry.username.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entry.username}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-neon-blue">
                    {entry.score.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
