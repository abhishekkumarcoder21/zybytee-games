'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play, Pause } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 120;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => useGameStore.getState().highScores['snake'] || 0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }]);
  const directionRef = useRef<Direction>('RIGHT');
  const foodRef = useRef<Position>({ x: 15, y: 10 });
  const gameLoopRef = useRef<number | null>(null);
  const lastDirectionRef = useRef<Direction>('RIGHT');

  const spawnFood = useCallback(() => {
    const snake = snakeRef.current;
    let pos: Position;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
    foodRef.current = pos;
  }, []);

  const resetGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = 'RIGHT';
    lastDirectionRef.current = 'RIGHT';
    spawnFood();
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
  }, [spawnFood]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cellW = w / GRID_SIZE;
    const cellH = h / GRID_SIZE;

    // Background
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellW, 0);
      ctx.lineTo(i * cellW, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellH);
      ctx.lineTo(w, i * cellH);
      ctx.stroke();
    }

    // Food
    const food = foodRef.current;
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(food.x * cellW + cellW / 2, food.y * cellH + cellH / 2, cellW / 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const progress = 1 - i / snake.length;
      const r = Math.round(0 + progress * 0);
      const g = Math.round(180 + progress * 32);
      const b = Math.round(220 + progress * 35);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      if (i === 0) {
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 10;
      }
      const padding = i === 0 ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(
        seg.x * cellW + padding,
        seg.y * cellH + padding,
        cellW - padding * 2,
        cellH - padding * 2,
        3
      );
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, []);

  const gameStep = useCallback(() => {
    if (gameOver || isPaused) return;

    const snake = [...snakeRef.current];
    const head = { ...snake[0] };
    const dir = directionRef.current;

    switch (dir) {
      case 'UP': head.y--; break;
      case 'DOWN': head.y++; break;
      case 'LEFT': head.x--; break;
      case 'RIGHT': head.x++; break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameOver(true);
      useGameStore.getState().submitScore('snake', score);
      setHighScore((prev) => Math.max(prev, score));
      return;
    }

    // Self collision
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      setGameOver(true);
      useGameStore.getState().submitScore('snake', score);
      setHighScore((prev) => Math.max(prev, score));
      return;
    }

    snake.unshift(head);

    // Food collision
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore((prev) => prev + 10);
      spawnFood();
    } else {
      snake.pop();
    }

    snakeRef.current = snake;
    lastDirectionRef.current = dir;
    draw();
  }, [gameOver, isPaused, score, spawnFood, draw]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const speed = Math.max(60, INITIAL_SPEED - Math.floor(score / 50) * 10);
    gameLoopRef.current = window.setInterval(gameStep, speed);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameStarted, gameOver, isPaused, score, gameStep]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: 'UP', KeyW: 'UP',
        ArrowDown: 'DOWN', KeyS: 'DOWN',
        ArrowLeft: 'LEFT', KeyA: 'LEFT',
        ArrowRight: 'RIGHT', KeyD: 'RIGHT',
      };

      const opposites: Record<Direction, Direction> = {
        UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT',
      };

      const newDir = keyMap[e.code];
      if (newDir && newDir !== opposites[lastDirectionRef.current]) {
        e.preventDefault();
        directionRef.current = newDir;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (!gameStarted) {
          resetGame();
        } else if (gameOver) {
          resetGame();
        } else {
          setIsPaused((p) => !p);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, resetGame]);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 p-4">
      {/* Score */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Score:</span>
          <span className="font-bold text-neon-blue text-lg">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Best:</span>
          <span className="font-bold text-neon-purple text-lg">{highScore}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="rounded-lg border border-white/10"
          style={{ width: '100%', maxWidth: '400px', aspectRatio: '1' }}
        />

        {/* Overlays */}
        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg">
            <h3 className="text-xl font-bold mb-4 gradient-text">Snake</h3>
            <Button onClick={resetGame} className="bg-neon-blue hover:bg-neon-blue/80 gap-2">
              <Play className="h-4 w-4" fill="white" /> Start Game
            </Button>
            <p className="text-xs text-muted-foreground mt-3">or press Space</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg">
            <h3 className="text-xl font-bold mb-1 text-red-400">Game Over!</h3>
            <p className="text-muted-foreground mb-4">Score: {score}</p>
            <Button onClick={resetGame} className="bg-neon-blue hover:bg-neon-blue/80 gap-2">
              <RotateCcw className="h-4 w-4" /> Play Again
            </Button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Paused</h3>
            <Button onClick={() => setIsPaused(false)} className="bg-neon-blue hover:bg-neon-blue/80 gap-2">
              <Play className="h-4 w-4" fill="white" /> Resume
            </Button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {gameStarted && !gameOver && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused((p) => !p)}
            className="border-white/10 text-xs"
          >
            {isPaused ? <Play className="h-3 w-3 mr-1" /> : <Pause className="h-3 w-3 mr-1" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={resetGame} className="border-white/10 text-xs">
          <RotateCcw className="h-3 w-3 mr-1" /> Restart
        </Button>
      </div>
    </div>
  );
}
