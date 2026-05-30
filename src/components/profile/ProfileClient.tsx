'use client';

import { useGameStore } from '@/hooks/useGameStore';
import { Trophy, Gamepad2, Clock, Star, Award, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { useState, useEffect } from 'react';

const rarityColors: Record<string, string> = {
  common: 'border-slate-500 text-slate-400',
  rare: 'border-blue-500 text-blue-400',
  epic: 'border-purple-500 text-purple-400',
  legendary: 'border-amber-500 text-amber-400',
};

export function ProfileClient() {
  const { recentlyPlayed, highScores, playTimes, resetStats } = useGameStore();
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

  // Calculate stats
  const uniqueGamesPlayed = recentlyPlayed.length;
  const totalSeconds = Object.values(playTimes).reduce((acc, curr) => acc + curr, 0);
  const totalHighScoresCount = Object.keys(highScores).length;

  const formatPlayTime = (seconds: number) => {
    if (seconds <= 0) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (hrs > 0) parts.push(`${hrs}h`);
    if (mins > 0) parts.push(`${mins}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
    return parts.join(' ');
  };

  // Check achievements
  const achievements = [
    { 
      id: 'first-game', 
      title: 'First Game', 
      description: 'Play your first game', 
      rarity: 'common', 
      icon: '🎮',
      unlocked: uniqueGamesPlayed >= 1
    },
    { 
      id: 'high-scorer', 
      title: 'High Scorer', 
      description: 'Score 1,000+ points in any game', 
      rarity: 'rare', 
      icon: '🏆',
      unlocked: Object.values(highScores).some(score => score >= 1000)
    },
    { 
      id: 'game-explorer', 
      title: 'Game Explorer', 
      description: 'Play 5 different games', 
      rarity: 'rare', 
      icon: '🧭',
      unlocked: uniqueGamesPlayed >= 5
    },
    { 
      id: 'dedicated-player', 
      title: 'Dedicated Player', 
      description: 'Play for 10 minutes total', 
      rarity: 'epic', 
      icon: '⏰',
      unlocked: totalSeconds >= 600
    },
    { 
      id: 'speed-demon', 
      title: 'Speed Demon', 
      description: 'Score 15+ in Flappy Bird', 
      rarity: 'legendary', 
      icon: '⚡',
      unlocked: (highScores['flappy-bird'] || 0) >= 15
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="rounded-xl border border-white/5 bg-card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple text-3xl font-bold select-none text-white shadow-lg shadow-neon-blue/20">
            G
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Guest Player</h1>
            <p className="text-sm text-muted-foreground mb-3">Your stats are saved locally on this browser</p>
            <div className="flex justify-center sm:justify-start gap-2 flex-wrap">
              <Button size="sm" variant="outline" className="border-white/10 rounded-xl text-xs gap-1.5" onClick={() => {
                if (confirm('Are you sure you want to reset all your stats and high scores?')) {
                  resetStats();
                }
              }}>
                <RotateCcw className="h-3.5 w-3.5" /> Reset Stats
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Gamepad2, label: 'Games Played', value: uniqueGamesPlayed, color: 'text-neon-blue' },
          { icon: Clock, label: 'Play Time', value: formatPlayTime(totalSeconds), color: 'text-neon-green' },
          { icon: Trophy, label: 'High Scores', value: totalHighScoresCount, color: 'text-yellow-400' },
          { icon: Star, label: 'Achievements', value: `${unlockedCount}/${achievements.length}`, color: 'text-neon-purple' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-xl border border-white/5 bg-card p-4 text-center">
            <Icon className={`h-5 w-5 ${color} mx-auto mb-2`} />
            <p className="text-lg font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Achievements List */}
      <div className="rounded-xl border border-white/5 bg-card p-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Award className="h-4 w-4 text-neon-purple" />
          Achievements
        </h2>
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                achievement.unlocked
                  ? 'bg-neon-blue/5 border-neon-blue/20 opacity-100 shadow-[0_0_12px_rgba(0,212,255,0.05)]'
                  : 'bg-white/[0.01] border-white/5 opacity-40 grayscale'
              }`}
            >
              <span className={`text-2xl ${achievement.unlocked ? 'animate-pulse' : ''}`}>{achievement.icon}</span>
              <div className="flex-1 text-left min-w-0">
                <p className="font-semibold text-sm truncate">{achievement.title}</p>
                <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
              </div>
              <Badge variant="outline" className={`text-[10px] capitalize select-none shrink-0 ${rarityColors[achievement.rarity]}`}>
                {achievement.rarity}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
