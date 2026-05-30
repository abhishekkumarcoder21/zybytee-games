'use client';

import { useGameStore } from '@/hooks/useGameStore';
import { games } from '@/data/games';
import { LeaderboardTable } from './LeaderboardTable';
import { Star, Gamepad2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { LeaderboardEntry } from '@/types/game';

// Mock leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', rank: 1, username: 'ProGamer99', avatar: '', gameId: 'snake', score: 15420, timestamp: '2024-12-20T10:30:00Z' },
  { id: '2', rank: 2, username: 'NightOwl', avatar: '', gameId: 'snake', score: 12890, timestamp: '2024-12-19T14:22:00Z' },
  { id: '3', rank: 3, username: 'SpeedRunner', avatar: '', gameId: 'snake', score: 11200, timestamp: '2024-12-18T09:15:00Z' },
  { id: '4', rank: 4, username: 'PixelMaster', avatar: '', gameId: 'snake', score: 9850, timestamp: '2024-12-17T16:45:00Z' },
  { id: '5', rank: 5, username: 'CyberNinja', avatar: '', gameId: 'snake', score: 8900, timestamp: '2024-12-16T11:30:00Z' },
  { id: '6', rank: 6, username: 'GameWizard', avatar: '', gameId: 'snake', score: 7650, timestamp: '2024-12-15T08:20:00Z' },
  { id: '7', rank: 7, username: 'StarPlayer', avatar: '', gameId: 'snake', score: 6800, timestamp: '2024-12-14T13:10:00Z' },
  { id: '8', rank: 8, username: 'NoobSlayer', avatar: '', gameId: 'snake', score: 5900, timestamp: '2024-12-13T19:55:00Z' },
  { id: '9', rank: 9, username: 'ArcadeKing', avatar: '', gameId: 'snake', score: 5200, timestamp: '2024-12-12T07:40:00Z' },
  { id: '10', rank: 10, username: 'RetroFan', avatar: '', gameId: 'snake', score: 4800, timestamp: '2024-12-11T15:25:00Z' },
];

export function LeaderboardClient() {
  const { highScores } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-neon-blue" />
      </div>
    );
  }

  // Get user high scores
  const userScores = Object.entries(highScores)
    .map(([gameId, score]) => {
      const gameObj = games.find((g) => g.id === gameId);
      return {
        gameId,
        gameTitle: gameObj?.title || gameId,
        gameSlug: gameObj?.slug || gameId,
        score,
      };
    })
    .filter((entry) => entry.score > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Global Leaderboards */}
      <div className="lg:col-span-2 space-y-6">
        <Tabs defaultValue="all-time" className="w-full">
          <TabsList className="bg-white/5 mb-4">
            <TabsTrigger value="all-time">All Time</TabsTrigger>
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="daily">Today</TabsTrigger>
          </TabsList>
          <TabsContent value="all-time">
            <LeaderboardTable entries={mockLeaderboard} title="All Time Leaders" />
          </TabsContent>
          <TabsContent value="weekly">
            <LeaderboardTable entries={mockLeaderboard.slice(0, 5)} title="Weekly Leaders" />
          </TabsContent>
          <TabsContent value="daily">
            <LeaderboardTable entries={mockLeaderboard.slice(0, 3)} title="Daily Leaders" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Local High Scores */}
      <div className="space-y-6">
        <div className="rounded-xl border border-white/5 bg-card p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Star className="h-4 w-4 text-neon-blue" />
            Your High Scores
          </h3>

          {userScores.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground space-y-3">
              <p>No high scores recorded yet.</p>
              <Link href="/games" className="inline-block">
                <button className="px-3 py-1.5 rounded-lg bg-neon-blue hover:bg-neon-blue/80 text-white font-medium text-xs gap-1.5 flex items-center transition-colors">
                  <Gamepad2 className="h-3.5 w-3.5" /> Play a Game
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userScores.map((entry) => (
                <Link key={entry.gameId} href={`/games/${entry.gameSlug}`} className="block">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-neon-blue/20 transition-all">
                    <div className="text-left min-w-0">
                      <p className="font-medium text-sm truncate text-white">{entry.gameTitle}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">Local score</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-neon-blue text-sm">
                        {entry.score.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
