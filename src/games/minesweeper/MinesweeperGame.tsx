'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Bomb, Clock } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';

const ROWS = 12;
const COLS = 16;
const MINES = 30;

interface CellData {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

function createBoard(): CellData[][] {
  const board: CellData[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0,
    }))
  );

  // Place mines
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].isMine) {
      board[r][c].isMine = true;
      placed++;
    }
  }

  // Calculate adjacent
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].isMine) count++;
        }
      }
      board[r][c].adjacentMines = count;
    }
  }
  return board;
}

const numColors: Record<number, string> = {
  1: 'text-blue-400',
  2: 'text-green-400',
  3: 'text-red-400',
  4: 'text-purple-400',
  5: 'text-yellow-400',
  6: 'text-cyan-400',
  7: 'text-pink-400',
  8: 'text-gray-400',
};

export default function MinesweeperGame() {
  const [board, setBoard] = useState<CellData[][]>(createBoard);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [flagCount, setFlagCount] = useState(0);
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started || gameOver || won) return;
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [started, gameOver, won]);

  const reveal = (board: CellData[][], r: number, c: number) => {
    const revealCell = (brd: CellData[][], row: number, col: number) => {
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
      if (brd[row][col].isRevealed || brd[row][col].isFlagged) return;
      brd[row][col].isRevealed = true;
      if (brd[row][col].adjacentMines === 0 && !brd[row][col].isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            revealCell(brd, row + dr, col + dc);
          }
        }
      }
    };
    revealCell(board, r, c);
  };

  const checkWin = (b: CellData[][]): boolean => {
    return b.every((row) =>
      row.every((cell) => cell.isRevealed || cell.isMine)
    );
  };

  const handleClick = (r: number, c: number) => {
    if (gameOver || won || board[r][c].isFlagged || board[r][c].isRevealed) return;

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    if (!started) setStarted(true);

    if (newBoard[r][c].isMine) {
      // Reveal all mines
      newBoard.forEach((row) => row.forEach((cell) => { if (cell.isMine) cell.isRevealed = true; }));
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    reveal(newBoard, r, c);
    setBoard(newBoard);
    if (checkWin(newBoard)) {
      setWon(true);
      useGameStore.getState().submitScore('minesweeper', Math.max(10, 2000 - time));
    }
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || won || board[r][c].isRevealed) return;
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
    setBoard(newBoard);
    setFlagCount((prev) => prev + (newBoard[r][c].isFlagged ? 1 : -1));
  };

  const resetGame = () => {
    setBoard(createBoard());
    setGameOver(false);
    setWon(false);
    setFlagCount(0);
    setTime(0);
    setStarted(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 p-4">
      {/* Status bar */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5">
          <Clock className="h-4 w-4 text-neon-blue" />
          <span className="font-bold">{time}s</span>
        </div>
        <Button variant="outline" size="sm" onClick={resetGame} className="border-white/10">
          <RotateCcw className="h-3 w-3 mr-1" /> New
        </Button>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5">
          <Bomb className="h-4 w-4 text-red-400" />
          <span className="font-bold">{MINES - flagCount}</span>
        </div>
      </div>

      {/* Board */}
      <div className="relative overflow-auto" style={{ maxWidth: '100%' }}>
        <div
          className="inline-grid gap-[1px] p-2 rounded-xl bg-white/5 border border-white/10"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => handleClick(r, c)}
                onContextMenu={(e) => handleRightClick(e, r, c)}
                className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs font-bold rounded-sm transition-all duration-100 ${
                  cell.isRevealed
                    ? cell.isMine
                      ? 'bg-red-900/60'
                      : 'bg-white/[0.03]'
                    : 'bg-white/10 hover:bg-white/20 cursor-pointer'
                }`}
              >
                {cell.isRevealed && cell.isMine && '💣'}
                {cell.isRevealed && !cell.isMine && cell.adjacentMines > 0 && (
                  <span className={numColors[cell.adjacentMines]}>{cell.adjacentMines}</span>
                )}
                {!cell.isRevealed && cell.isFlagged && '🚩'}
              </button>
            ))
          )}
        </div>

        {/* Overlays */}
        {(gameOver || won) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <h3 className={`text-xl font-bold mb-2 ${won ? 'gradient-text' : 'text-red-400'}`}>
              {won ? '🎉 You Win!' : '💥 Game Over!'}
            </h3>
            <Button onClick={resetGame} className="bg-neon-blue hover:bg-neon-blue/80 gap-2">
              <RotateCcw className="h-4 w-4" /> Play Again
            </Button>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">Left click to reveal • Right click to flag</p>
    </div>
  );
}
