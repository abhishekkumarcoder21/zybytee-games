'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Bot } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';

type Cell = 'X' | 'O' | null;
type Board = Cell[];

function checkWinner(board: Board): Cell | 'draw' | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every((c) => c !== null)) return 'draw';
  return null;
}

function minimax(board: Board, isMax: boolean): number {
  const result = checkWinner(board);
  if (result === 'O') return 10;
  if (result === 'X') return -10;
  if (result === 'draw') return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function getBestMove(board: Board): number {
  let bestVal = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      const val = minimax(board, false);
      board[i] = null;
      if (val > bestVal) {
        bestVal = val;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

export default function TicTacToeGame() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [scores, setScores] = useState(() => {
    const savedHighScore = useGameStore.getState().highScores['tic-tac-toe'] || 0;
    const wins = Math.floor(savedHighScore / 100);
    return { player: wins, ai: 0, draws: 0 };
  });

  const result = checkWinner(board);

  const handleClick = (index: number) => {
    if (board[index] || result || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';

    const afterPlayer = checkWinner(newBoard);
    if (afterPlayer) {
      setBoard(newBoard);
      if (afterPlayer === 'X') {
        const newWins = scores.player + 1;
        setScores((s) => ({ ...s, player: newWins }));
        useGameStore.getState().submitScore('tic-tac-toe', newWins * 100);
      } else if (afterPlayer === 'draw') {
        setScores((s) => ({ ...s, draws: s.draws + 1 }));
      }
      return;
    }

    // AI move
    const aiMove = getBestMove(newBoard);
    if (aiMove >= 0) {
      newBoard[aiMove] = 'O';
      const afterAI = checkWinner(newBoard);
      if (afterAI === 'O') setScores((s) => ({ ...s, ai: s.ai + 1 }));
      else if (afterAI === 'draw') setScores((s) => ({ ...s, draws: s.draws + 1 }));
    }

    setBoard(newBoard);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
  };

  const getResultMessage = () => {
    if (result === 'X') return '🎉 You Win!';
    if (result === 'O') return '🤖 AI Wins!';
    if (result === 'draw') return '🤝 Draw!';
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-5 p-4">
      {/* Scores */}
      <div className="flex items-center gap-4 text-sm">
        <div className="px-4 py-2 rounded-lg bg-neon-blue/10 border border-neon-blue/20 text-center">
          <span className="text-xs text-muted-foreground block">You (X)</span>
          <span className="font-bold text-neon-blue text-lg">{scores.player}</span>
        </div>
        <div className="px-4 py-2 rounded-lg bg-white/5 text-center">
          <span className="text-xs text-muted-foreground block">Draws</span>
          <span className="font-bold text-lg">{scores.draws}</span>
        </div>
        <div className="px-4 py-2 rounded-lg bg-neon-purple/10 border border-neon-purple/20 text-center">
          <span className="text-xs text-muted-foreground block">AI (O)</span>
          <span className="font-bold text-neon-purple text-lg">{scores.ai}</span>
        </div>
      </div>

      {/* Board */}
      <div className="relative">
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/5 border border-white/10"
          style={{ width: 'min(280px, 80vw)' }}>
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={!!cell || !!result}
              className={`aspect-square flex items-center justify-center rounded-lg text-3xl font-bold transition-all duration-200 ${
                cell
                  ? cell === 'X'
                    ? 'bg-neon-blue/20 text-neon-blue'
                    : 'bg-neon-purple/20 text-neon-purple'
                  : 'bg-white/[0.03] hover:bg-white/10 cursor-pointer'
              }`}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Result overlay */}
        {result && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <p className="text-xl font-bold mb-4">{getResultMessage()}</p>
            <Button onClick={resetGame} className="bg-neon-blue hover:bg-neon-blue/80 gap-2">
              <RotateCcw className="h-4 w-4" /> Play Again
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Bot className="h-3 w-3" />
        Playing against unbeatable AI
      </div>
    </div>
  );
}
