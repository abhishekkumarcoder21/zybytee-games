'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';

const CANVAS_W = 400;
const CANVAS_H = 600;
const BIRD_SIZE = 20;
const GRAVITY = 0.35;
const JUMP = -6.5;
const PIPE_WIDTH = 50;
const PIPE_GAP = 140;
const PIPE_SPEED = 2.5;

interface Pipe {
  x: number;
  topH: number;
  scored: boolean;
}

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => useGameStore.getState().highScores['flappy-bird'] || 0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const birdRef = useRef({ y: CANVAS_H / 2, vel: 0 });
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const gameLoopRef = useRef<() => void>(() => {});

  const spawnPipe = useCallback(() => {
    const minTop = 60;
    const maxTop = CANVAS_H - PIPE_GAP - 60;
    const topH = minTop + Math.random() * (maxTop - minTop);
    pipesRef.current.push({ x: CANVAS_W, topH, scored: false });
  }, []);

  const jump = useCallback(() => {
    if (gameOver) return;
    if (!started) {
      setStarted(true);
      birdRef.current = { y: CANVAS_H / 2, vel: 0 };
      pipesRef.current = [];
      scoreRef.current = 0;
      setScore(0);
      setGameOver(false);
      frameRef.current = 0;
    }
    birdRef.current.vel = JUMP;
  }, [gameOver, started]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, '#0a0e2a');
    grad.addColorStop(0.5, '#0f1535');
    grad.addColorStop(1, '#0a1020');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    for (let i = 0; i < 30; i++) {
      const sx = (i * 97 + frameRef.current * 0.1) % CANVAS_W;
      const sy = (i * 53) % (CANVAS_H * 0.5);
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    // Ground
    ctx.fillStyle = '#1a1f35';
    ctx.fillRect(0, CANVAS_H - 30, CANVAS_W, 30);
    ctx.fillStyle = '#22d3ee33';
    ctx.fillRect(0, CANVAS_H - 30, CANVAS_W, 2);

    // Pipes
    pipesRef.current.forEach((pipe) => {
      // Top pipe
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topH);
      ctx.fillStyle = '#9333ea';
      ctx.fillRect(pipe.x - 3, pipe.topH - 20, PIPE_WIDTH + 6, 20);

      // Bottom pipe
      const bottomY = pipe.topH + PIPE_GAP;
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, CANVAS_H - bottomY - 30);
      ctx.fillStyle = '#9333ea';
      ctx.fillRect(pipe.x - 3, bottomY, PIPE_WIDTH + 6, 20);

      // Glow
      ctx.shadowColor = '#7c3aed';
      ctx.shadowBlur = 8;
      ctx.fillStyle = 'rgba(124, 58, 237, 0.1)';
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topH);
      ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, CANVAS_H - bottomY);
      ctx.shadowBlur = 0;
    });

    // Bird
    const bird = birdRef.current;
    ctx.save();
    ctx.translate(80, bird.y);
    ctx.rotate(Math.min(bird.vel * 0.05, 0.5));

    // Bird body
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#00d4ff';
    ctx.beginPath();
    ctx.arc(0, 0, BIRD_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(5, -3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0a0e1a';
    ctx.beginPath();
    ctx.arc(6, -3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(BIRD_SIZE / 2, -2);
    ctx.lineTo(BIRD_SIZE / 2 + 8, 2);
    ctx.lineTo(BIRD_SIZE / 2, 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }, []);

  const gameLoop = useCallback(() => {
    if (!started || gameOver) {
      draw();
      return;
    }

    const bird = birdRef.current;
    bird.vel += GRAVITY;
    bird.y += bird.vel;

    // Ground/ceiling collision
    if (bird.y < BIRD_SIZE / 2 || bird.y > CANVAS_H - 30 - BIRD_SIZE / 2) {
      setGameOver(true);
      setStarted(false);
      const currentScore = scoreRef.current;
      useGameStore.getState().submitScore('flappy-bird', currentScore);
      setBestScore((prev) => Math.max(prev, currentScore));
      draw();
      return;
    }

    // Pipes
    frameRef.current++;
    if (frameRef.current % 90 === 0) spawnPipe();

    pipesRef.current = pipesRef.current.filter((p) => p.x > -PIPE_WIDTH);
    pipesRef.current.forEach((pipe) => {
      pipe.x -= PIPE_SPEED;

      // Collision
      const birdLeft = 80 - BIRD_SIZE / 2;
      const birdRight = 80 + BIRD_SIZE / 2;
      const birdTop = bird.y - BIRD_SIZE / 2;
      const birdBottom = bird.y + BIRD_SIZE / 2;

      if (birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH) {
        if (birdTop < pipe.topH || birdBottom > pipe.topH + PIPE_GAP) {
          setGameOver(true);
          setStarted(false);
          const currentScore = scoreRef.current;
          useGameStore.getState().submitScore('flappy-bird', currentScore);
          setBestScore((prev) => Math.max(prev, currentScore));
        }
      }

      // Score
      if (!pipe.scored && pipe.x + PIPE_WIDTH < 80) {
        pipe.scored = true;
        scoreRef.current++;
        setScore(scoreRef.current);
      }
    });

    draw();

    if (!gameOver) {
      rafRef.current = requestAnimationFrame(() => gameLoopRef.current());
    }
  }, [started, gameOver, draw, spawnPipe]);

  useEffect(() => {
    gameLoopRef.current = gameLoop;
  }, [gameLoop]);

  useEffect(() => {
    if (started && !gameOver) {
      rafRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [started, gameOver, gameLoop]);

  // Initial draw
  useEffect(() => { draw(); }, [draw]);

  // Controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameOver) {
          setGameOver(false);
          setStarted(false);
          birdRef.current = { y: CANVAS_H / 2, vel: 0 };
          pipesRef.current = [];
          scoreRef.current = 0;
          setScore(0);
          setTimeout(() => jump(), 50);
        } else {
          jump();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [jump, gameOver]);

  const handleCanvasClick = () => {
    if (gameOver) {
      setGameOver(false);
      setStarted(false);
      birdRef.current = { y: CANVAS_H / 2, vel: 0 };
      pipesRef.current = [];
      scoreRef.current = 0;
      setScore(0);
      setTimeout(() => jump(), 50);
    } else {
      jump();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 p-4">
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Score:</span>
          <span className="font-bold text-neon-blue text-lg">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Best:</span>
          <span className="font-bold text-neon-purple text-lg">{bestScore}</span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          onClick={handleCanvasClick}
          className="rounded-lg border border-white/10 cursor-pointer"
          style={{ width: '100%', maxWidth: '300px' }}
        />

        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-lg">
            <h3 className="text-xl font-bold mb-4 gradient-text">Flappy Bird</h3>
            <p className="text-sm text-muted-foreground mb-4">Click or press Space to fly</p>
            <Button onClick={() => jump()} className="bg-neon-blue hover:bg-neon-blue/80 gap-2">
              <Play className="h-4 w-4" fill="white" /> Start
            </Button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg">
            <h3 className="text-xl font-bold mb-1 text-red-400">Game Over!</h3>
            <p className="text-muted-foreground mb-4">Score: {score}</p>
            <Button onClick={handleCanvasClick} className="bg-neon-blue hover:bg-neon-blue/80 gap-2">
              <RotateCcw className="h-4 w-4" /> Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
