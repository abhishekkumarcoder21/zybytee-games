'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play, Pause } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';

const WIDTH = 600;
const HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 8;
const INITIAL_BALL_SPEED = 4;
const MAX_BALL_SPEED = 12;
const AI_SPEED = 3.8;

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [winner, setWinner] = useState<'player' | 'ai' | null>(null);

  const playerY = useRef((HEIGHT - PADDLE_HEIGHT) / 2);
  const aiY = useRef((HEIGHT - PADDLE_HEIGHT) / 2);
  const ball = useRef({
    x: WIDTH / 2,
    y: HEIGHT / 2,
    vx: INITIAL_BALL_SPEED,
    vy: INITIAL_BALL_SPEED,
    speed: INITIAL_BALL_SPEED
  });

  const resetBall = useCallback((direction: 1 | -1) => {
    ball.current.x = WIDTH / 2;
    ball.current.y = HEIGHT / 2;
    ball.current.speed = INITIAL_BALL_SPEED;
    ball.current.vx = direction * INITIAL_BALL_SPEED;
    ball.current.vy = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  }, []);

  const resetGame = useCallback(() => {
    setPlayerScore(0);
    setAiScore(0);
    setGameOver(false);
    setGameStarted(true);
    setIsPaused(false);
    setWinner(null);
    playerY.current = (HEIGHT - PADDLE_HEIGHT) / 2;
    aiY.current = (HEIGHT - PADDLE_HEIGHT) / 2;
    resetBall(Math.random() > 0.5 ? 1 : -1);
  }, [resetBall]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Dotted center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // Player Paddle (Left)
    ctx.fillStyle = '#00d4ff';
    ctx.shadowColor = '#00d4ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(20, playerY.current, PADDLE_WIDTH, PADDLE_HEIGHT);

    // AI Paddle (Right)
    ctx.fillStyle = '#7c3aed';
    ctx.shadowColor = '#7c3aed';
    ctx.shadowBlur = 10;
    ctx.fillRect(WIDTH - 20 - PADDLE_WIDTH, aiY.current, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(ball.current.x, ball.current.y, BALL_SIZE, 0, Math.PI * 2);
    ctx.fill();

    // Disable shadow blur for performance
    ctx.shadowBlur = 0;
  }, []);

  const update = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return;

    const b = ball.current;
    
    // Move ball
    b.x += b.vx;
    b.y += b.vy;

    // Wall collision (Top / Bottom)
    if (b.y - BALL_SIZE <= 0) {
      b.y = BALL_SIZE;
      b.vy = -b.vy;
    } else if (b.y + BALL_SIZE >= HEIGHT) {
      b.y = HEIGHT - BALL_SIZE;
      b.vy = -b.vy;
    }

    // AI Paddle movement (Simple tracking tracking with max speed limit)
    const targetY = b.y - PADDLE_HEIGHT / 2;
    const diff = targetY - aiY.current;
    if (Math.abs(diff) > 2) {
      aiY.current += Math.sign(diff) * Math.min(Math.abs(diff), AI_SPEED);
      // Bound paddle
      aiY.current = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, aiY.current));
    }

    // Collision Player (Left Paddle)
    const paddleLeft = 20;
    const paddleRight = 20 + PADDLE_WIDTH;
    if (b.x - BALL_SIZE <= paddleRight && b.x + BALL_SIZE >= paddleLeft) {
      if (b.y >= playerY.current && b.y <= playerY.current + PADDLE_HEIGHT) {
        b.x = paddleRight + BALL_SIZE;
        // Bounce physics: angle changes based on hit point relative to paddle center
        const relativeHit = (b.y - (playerY.current + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        b.speed = Math.min(MAX_BALL_SPEED, b.speed + 0.5);
        b.vx = b.speed;
        b.vy = relativeHit * b.speed * 0.8;
      }
    }

    // Collision AI (Right Paddle)
    const aiLeft = WIDTH - 20 - PADDLE_WIDTH;
    const aiRight = WIDTH - 20;
    if (b.x + BALL_SIZE >= aiLeft && b.x - BALL_SIZE <= aiRight) {
      if (b.y >= aiY.current && b.y <= aiY.current + PADDLE_HEIGHT) {
        b.x = aiLeft - BALL_SIZE;
        const relativeHit = (b.y - (aiY.current + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        b.speed = Math.min(MAX_BALL_SPEED, b.speed + 0.5);
        b.vx = -b.speed;
        b.vy = relativeHit * b.speed * 0.8;
      }
    }

    // Score Check
    if (b.x < 0) {
      // AI Scores
      setAiScore((prev) => {
        const newVal = prev + 1;
        if (newVal >= 5) {
          setGameOver(true);
          setWinner('ai');
          useGameStore.getState().submitScore('pong', playerScore * 50);
        } else {
          resetBall(1);
        }
        return newVal;
      });
    } else if (b.x > WIDTH) {
      // Player Scores
      setPlayerScore((prev) => {
        const newVal = prev + 1;
        if (newVal >= 5) {
          setGameOver(true);
          setWinner('player');
          const finalScore = (5 - aiScore) * 100 + 500;
          useGameStore.getState().submitScore('pong', finalScore);
        } else {
          resetBall(-1);
        }
        return newVal;
      });
    }
  }, [gameOver, isPaused, gameStarted, resetBall, playerScore, aiScore]);

  // Main Loop
  useEffect(() => {
    let animationId: number;

    const loop = () => {
      update();
      draw();
      animationId = requestAnimationFrame(loop);
    };

    if (gameStarted && !gameOver && !isPaused) {
      animationId = requestAnimationFrame(loop);
    } else {
      draw(); // Draw initial or paused board
    }

    return () => cancelAnimationFrame(animationId);
  }, [gameStarted, gameOver, isPaused, update, draw]);

  // Handle controls (mouse movement over canvas)
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    // Scale factor in case canvas is scaled in CSS
    const scale = HEIGHT / rect.height;
    const clientY = (e.clientY - rect.top) * scale;
    playerY.current = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, clientY - PADDLE_HEIGHT / 2));
  };

  // Touch controls
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = HEIGHT / rect.height;
    const clientY = (e.touches[0].clientY - rect.top) * scale;
    playerY.current = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, clientY - PADDLE_HEIGHT / 2));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 p-4 text-center max-w-xl mx-auto">
      {/* Score Header */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground">Player</span>
          <span className="font-bold text-neon-blue text-2xl">{playerScore}</span>
        </div>
        <div className="text-muted-foreground font-semibold text-lg">vs</div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground">AI</span>
          <span className="font-bold text-neon-purple text-2xl">{aiScore}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="rounded-xl border border-white/10 max-w-full aspect-[3/2] bg-gaming-dark"
          style={{ width: 'min(500px, 90vw)' }}
        />

        {/* Start Game Overlay */}
        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 rounded-xl">
            <h3 className="text-2xl font-bold mb-1 gradient-text animate-pulse">Pong</h3>
            <p className="text-xs text-muted-foreground mb-4 max-w-xs">
              Move your mouse or slide your finger on the board to move your paddle. First to 5 wins!
            </p>
            <Button onClick={resetGame} className="bg-neon-blue hover:bg-neon-blue/80 gap-2">
              <Play className="h-4 w-4" fill="white" /> Start Game
            </Button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-xl">
            <h3 className={`text-2xl font-bold mb-2 ${winner === 'player' ? 'gradient-text' : 'text-red-400'}`}>
              {winner === 'player' ? '🎉 Victory!' : '💀 Defeat!'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Final score: {playerScore} to {aiScore}
            </p>
            <Button onClick={resetGame} className="bg-neon-blue hover:bg-neon-blue/80 gap-2">
              <RotateCcw className="h-4 w-4" /> Play Again
            </Button>
          </div>
        )}

        {/* Paused Overlay */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <h3 className="text-xl font-bold mb-4">Paused</h3>
            <Button onClick={() => setIsPaused(false)} className="bg-neon-blue hover:bg-neon-blue/80 gap-2">
              <Play className="h-4 w-4" fill="white" /> Resume
            </Button>
          </div>
        )}
      </div>

      {/* Control Buttons */}
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
