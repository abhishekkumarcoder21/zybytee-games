'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Clock, Trophy } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🎮', '🕹️', '👾', '🚀', '👑', '💎', '🎨', '🧩'];

export default function MemoryMatchGame() {
  const [cards, setCards] = useState<Card[]>(() => {
    const pairEmojis = [...EMOJIS, ...EMOJIS];
    // Fisher-Yates Shuffle
    for (let i = pairEmojis.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairEmojis[i], pairEmojis[j]] = [pairEmojis[j], pairEmojis[i]];
    }
    return pairEmojis.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
  });
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const initGame = () => {
    const pairEmojis = [...EMOJIS, ...EMOJIS];
    // Fisher-Yates Shuffle
    for (let i = pairEmojis.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairEmojis[i], pairEmojis[j]] = [pairEmojis[j], pairEmojis[i]];
    }

    const initialCards = pairEmojis.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initialCards);
    setSelected([]);
    setMoves(0);
    setWon(false);
    setTime(0);
    setGameStarted(false);
  };

  // Timer Effect
  useEffect(() => {
    if (!gameStarted || won) return;
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStarted, won]);

  const handleCardClick = (index: number) => {
    if (won || cards[index].isFlipped || cards[index].isMatched || selected.length >= 2) return;

    if (!gameStarted) {
      setGameStarted(true);
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newSelected;

      if (cards[firstIdx].emoji === cards[secondIdx].emoji) {
        // Match!
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[firstIdx].isMatched = true;
            updated[secondIdx].isMatched = true;
            
            // Check win
            if (updated.every((c) => c.isMatched)) {
              setWon(true);
              const score = Math.max(50, 1000 - moves * 15 - time);
              useGameStore.getState().submitScore('memory-match', score);
            }
            return updated;
          });
          setSelected([]);
        }, 300);
      } else {
        // No match, flip back
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[firstIdx].isFlipped = false;
            updated[secondIdx].isFlipped = false;
            return updated;
          });
          setSelected([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 p-4 text-center max-w-sm mx-auto">
      {/* Stats Header */}
      <div className="flex items-center justify-between w-full text-xs sm:text-sm">
        <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
          <Trophy className="h-3.5 w-3.5 text-neon-orange" />
          <span className="font-semibold">{moves} Moves</span>
        </div>
        <Button variant="outline" size="sm" onClick={initGame} className="border-white/10 text-xs py-1 h-7">
          <RotateCcw className="h-3 w-3 mr-1" /> Restart
        </Button>
        <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
          <Clock className="h-3.5 w-3.5 text-neon-blue" />
          <span className="font-semibold">{time}s</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2 w-full aspect-square bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
        {cards.map((card, index) => {
          const showFace = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className="relative aspect-square w-full rounded-xl overflow-hidden focus:outline-none transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
              style={{ perspective: '1000px' }}
            >
              <div 
                className="w-full h-full transition-transform duration-500 relative"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: showFace ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Back of card (facedown) */}
                <div 
                  className={`absolute inset-0 rounded-xl border flex items-center justify-center bg-gradient-to-br from-gaming-dark to-slate-900 border-white/10 shadow-[0_0_10px_rgba(124,58,237,0.1)]`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="text-xl sm:text-2xl text-neon-purple/30">?</span>
                </div>

                {/* Front of card (faceup) */}
                <div 
                  className={`absolute inset-0 rounded-xl border flex items-center justify-center text-2xl sm:text-3xl bg-slate-800 ${
                    card.isMatched 
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                      : 'border-neon-blue/40 bg-neon-blue/5 shadow-[0_0_15px_rgba(0,212,255,0.1)]'
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  {card.emoji}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Instructions */}
      <p className="text-[10px] text-muted-foreground">Find matching pairs by clicking on cards.</p>

      {/* Winner Overlay */}
      {won && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-2xl z-10 p-6">
          <Trophy className="h-12 w-12 text-yellow-400 mb-2 animate-bounce" />
          <h3 className="text-xl font-bold mb-1 gradient-text">Victory!</h3>
          <p className="text-xs text-muted-foreground mb-4">
            You completed the puzzle in {moves} moves and {time} seconds.
          </p>
          <Button onClick={initGame} className="bg-neon-blue hover:bg-neon-blue/80 gap-2">
            <RotateCcw className="h-4 w-4" /> Play Again
          </Button>
        </div>
      )}
    </div>
  );
}
