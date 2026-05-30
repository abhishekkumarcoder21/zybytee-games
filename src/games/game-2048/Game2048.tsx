'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';

type Board = (number | null)[][];

function createEmptyBoard(): Board {
  return Array.from({ length: 4 }, () => Array(4).fill(null));
}

function addRandom(board: Board): Board {
  const empty: [number, number][] = [];
  board.forEach((row, r) => row.forEach((cell, c) => { if (cell === null) empty.push([r, c]); }));
  if (empty.length === 0) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const newBoard = board.map((row) => [...row]);
  newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
}

function slide(row: (number | null)[]): { result: (number | null)[]; score: number } {
  const nums = row.filter((x): x is number => x !== null);
  let score = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      merged.push(nums[i] * 2);
      score += nums[i] * 2;
      i += 2;
    } else {
      merged.push(nums[i]);
      i++;
    }
  }
  while (merged.length < 4) merged.push(null as unknown as number);
  return { result: merged as (number | null)[], score };
}

function moveBoard(board: Board, direction: string): { board: Board; score: number; moved: boolean } {
  let totalScore = 0;
  let moved = false;
  let newBoard = board.map((row) => [...row]);

  const process = (rows: (number | null)[][]) => {
    return rows.map((row) => {
      const { result, score } = slide(row);
      totalScore += score;
      if (row.some((v, i) => v !== result[i])) moved = true;
      return result;
    });
  };

  switch (direction) {
    case 'LEFT':
      newBoard = process(newBoard);
      break;
    case 'RIGHT':
      newBoard = process(newBoard.map((r) => [...r].reverse())).map((r) => [...r].reverse());
      break;
    case 'UP': {
      const cols = Array.from({ length: 4 }, (_, c) => newBoard.map((r) => r[c]));
      const processed = process(cols);
      newBoard = Array.from({ length: 4 }, (_, r) => processed.map((col) => col[r]));
      break;
    }
    case 'DOWN': {
      const cols = Array.from({ length: 4 }, (_, c) => newBoard.map((r) => r[c]).reverse());
      const processed = process(cols).map((col) => [...col].reverse());
      newBoard = Array.from({ length: 4 }, (_, r) => processed.map((col) => col[r]));
      break;
    }
  }

  return { board: newBoard, score: totalScore, moved };
}

function canMove(board: Board): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === null) return true;
      if (c < 3 && board[r][c] === board[r][c + 1]) return true;
      if (r < 3 && board[r][c] === board[r + 1][c]) return true;
    }
  }
  return false;
}

function hasWon(board: Board): boolean {
  return board.some((row) => row.some((cell) => cell === 2048));
}

const tileColors: Record<number, { bg: string; text: string }> = {
  2: { bg: 'bg-slate-600', text: 'text-white' },
  4: { bg: 'bg-slate-500', text: 'text-white' },
  8: { bg: 'bg-orange-600', text: 'text-white' },
  16: { bg: 'bg-orange-500', text: 'text-white' },
  32: { bg: 'bg-red-500', text: 'text-white' },
  64: { bg: 'bg-red-600', text: 'text-white' },
  128: { bg: 'bg-yellow-500', text: 'text-white' },
  256: { bg: 'bg-yellow-400', text: 'text-gray-900' },
  512: { bg: 'bg-yellow-300', text: 'text-gray-900' },
  1024: { bg: 'bg-amber-400', text: 'text-gray-900' },
  2048: { bg: 'bg-neon-blue', text: 'text-white' },
};

export default function Game2048() {
  const [board, setBoard] = useState<Board>(() => addRandom(addRandom(createEmptyBoard())));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => useGameStore.getState().highScores['2048'] || 0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const handleMove = useCallback(
    (direction: string) => {
      if (gameOver) return;
      const { board: newBoard, score: gained, moved } = moveBoard(board, direction);
      if (!moved) return;
      const withNew = addRandom(newBoard);
      setBoard(withNew);
      setScore((prev) => {
        const newScore = prev + gained;
        useGameStore.getState().submitScore('2048', newScore);
        setBestScore((best) => Math.max(best, newScore));
        return newScore;
      });
      if (hasWon(withNew) && !won) {
        setWon(true);
        useGameStore.getState().submitScore('2048', score + gained);
      }
      if (!canMove(withNew)) {
        setGameOver(true);
        useGameStore.getState().submitScore('2048', score + gained);
      }
    },
    [board, gameOver, won, score]
  );

  const resetGame = () => {
    setBoard(addRandom(addRandom(createEmptyBoard())));
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const map: Record<string, string> = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        KeyW: 'UP', KeyS: 'DOWN', KeyA: 'LEFT', KeyD: 'RIGHT',
      };
      if (map[e.code]) {
        e.preventDefault();
        handleMove(map[e.code]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  // Touch support
  useEffect(() => {
    let startX = 0, startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        handleMove(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        handleMove(dy > 0 ? 'DOWN' : 'UP');
      }
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMove]);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 p-4">
      {/* Score */}
      <div className="flex items-center gap-6 text-sm">
        <div className="px-4 py-2 rounded-lg bg-white/5 text-center">
          <span className="text-xs text-muted-foreground block">Score</span>
          <span className="font-bold text-neon-blue text-lg">{score}</span>
        </div>
        <div className="px-4 py-2 rounded-lg bg-white/5 text-center">
          <span className="text-xs text-muted-foreground block">Best</span>
          <span className="font-bold text-neon-purple text-lg">{bestScore}</span>
        </div>
        <Button variant="outline" size="sm" onClick={resetGame} className="border-white/10">
          <RotateCcw className="h-3 w-3 mr-1" /> New
        </Button>
      </div>

      {/* Board */}
      <div className="relative">
        <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-white/5 border border-white/10"
          style={{ width: 'min(340px, 90vw)' }}>
          {board.flat().map((cell, i) => {
            const colors = cell ? tileColors[cell] || { bg: 'bg-neon-purple', text: 'text-white' } : null;
            return (
              <div
                key={i}
                className={`aspect-square flex items-center justify-center rounded-lg font-bold transition-all duration-150 ${
                  cell
                    ? `${colors!.bg} ${colors!.text} ${cell >= 1024 ? 'text-lg' : cell >= 128 ? 'text-xl' : 'text-2xl'}`
                    : 'bg-white/[0.03]'
                }`}
              >
                {cell}
              </div>
            );
          })}
        </div>

        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <h3 className="text-xl font-bold mb-2 text-red-400">Game Over!</h3>
            <p className="text-muted-foreground mb-4">Final Score: {score}</p>
            <Button onClick={resetGame} className="bg-neon-blue hover:bg-neon-blue/80 gap-2">
              <RotateCcw className="h-4 w-4" /> Try Again
            </Button>
          </div>
        )}

        {won && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <Trophy className="h-12 w-12 text-yellow-400 mb-2" />
            <h3 className="text-xl font-bold mb-2 gradient-text">You Win!</h3>
            <p className="text-muted-foreground mb-4">Score: {score}</p>
            <div className="flex gap-2">
              <Button onClick={() => setWon(false)} variant="outline" className="border-white/20">
                Keep Playing
              </Button>
              <Button onClick={resetGame} className="bg-neon-blue hover:bg-neon-blue/80">
                New Game
              </Button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">Use arrow keys or swipe to play</p>
    </div>
  );
}
