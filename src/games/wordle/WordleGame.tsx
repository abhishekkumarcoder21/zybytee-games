'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

const WORDS = [
  'REACT', 'GAMER', 'CODES', 'PIXEL', 'MOUSE', 
  'SNAKE', 'BOARD', 'CHESS', 'MATCH', 'LEVEL', 
  'FRUIT', 'TOWER', 'DRIVE', 'NINJA', 'SMART', 
  'LOGIC', 'WORLD', 'SPACE', 'FOCUS', 'CRAFT'
];

type KeyStatus = 'correct' | 'present' | 'absent' | 'unused';

export default function WordleGame() {
  const [solution, setSolution] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [message, setMessage] = useState('');
  const [shakeRow, setShakeRow] = useState<number | null>(null);

  const startNewGame = useCallback(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setSolution(randomWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setWon(false);
    setMessage('');
  }, []);

  const getLetterStatus = (letter: string, index: number): KeyStatus => {
    if (solution[index] === letter) return 'correct';
    if (solution.includes(letter)) {
      // Handle duplicate letters logic simply or strictly
      return 'present';
    }
    return 'absent';
  };

  const handleKeyInput = useCallback((key: string) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) {
        setMessage('Not enough letters');
        setShakeRow(guesses.length);
        setTimeout(() => setShakeRow(null), 500);
        return;
      }

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');
      setMessage('');

      if (currentGuess === solution) {
        setWon(true);
        setGameOver(true);
        const score = (MAX_ATTEMPTS - guesses.length) * 200;
        useGameStore.getState().submitScore('wordle', score);
        setMessage(`Awesome! Score: ${score}`);
      } else if (newGuesses.length === MAX_ATTEMPTS) {
        setGameOver(true);
        setMessage(`Game Over! The word was ${solution}`);
        useGameStore.getState().submitScore('wordle', 50); // Small participation points
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key)) {
      if (currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + key);
      }
    }
  }, [currentGuess, guesses, solution, gameOver]);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'ENTER' || key === 'BACKSPACE') {
        handleKeyInput(key);
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyInput(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyInput]);

  // Get status of keyboard keys
  const getKeyStatuses = (): Record<string, KeyStatus> => {
    const statuses: Record<string, KeyStatus> = {};
    guesses.forEach((guess) => {
      for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        const currentStatus = statuses[letter];
        const newStatus = getLetterStatus(letter, i);
        
        if (newStatus === 'correct') {
          statuses[letter] = 'correct';
        } else if (newStatus === 'present' && currentStatus !== 'correct') {
          statuses[letter] = 'present';
        } else if (newStatus === 'absent' && currentStatus !== 'correct' && currentStatus !== 'present') {
          statuses[letter] = 'absent';
        }
      }
    });
    return statuses;
  };

  const keyStatuses = getKeyStatuses();

  const getBgClass = (status: KeyStatus) => {
    switch (status) {
      case 'correct': return 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]';
      case 'present': return 'bg-amber-500 border-amber-400 text-white shadow-[0_0_10px_rgba(245,158,11,0.3)]';
      case 'absent': return 'bg-slate-800 border-slate-700 text-slate-400';
      default: return 'bg-white/[0.03] border-white/10 text-white hover:bg-white/10';
    }
  };

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[450px] gap-4 p-4 text-center select-none max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex justify-between items-center w-full mb-2">
        <h3 className="text-xl font-bold gradient-text">Wordle</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={startNewGame} className="border-white/10 text-xs">
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-rows-6 gap-1.5 mb-2 w-full max-w-[280px]">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, rIndex) => {
          const isCurrentRow = rIndex === guesses.length;
          const guess = guesses[rIndex] || (isCurrentRow ? currentGuess : '');
          const isShaking = shakeRow === rIndex;

          return (
            <div 
              key={rIndex} 
              className={`grid grid-cols-5 gap-1.5 ${isShaking ? 'animate-bounce' : ''}`}
            >
              {Array.from({ length: WORD_LENGTH }).map((_, cIndex) => {
                const letter = guess[cIndex] || '';
                const isRevealed = rIndex < guesses.length;
                const status = isRevealed ? getLetterStatus(letter, cIndex) : 'unused';

                return (
                  <div
                    key={cIndex}
                    className={`aspect-square w-full flex items-center justify-center font-bold text-lg rounded-lg border transition-all duration-300 ${
                      isRevealed 
                        ? getBgClass(status) 
                        : letter 
                          ? 'border-neon-blue/50 bg-neon-blue/5 text-white scale-105' 
                          : 'border-white/10 bg-white/[0.02] text-white/40'
                    }`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Message Info */}
      {message && (
        <div className={`text-xs font-semibold py-1 px-3 rounded-full ${
          won ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' : 'text-orange-400 bg-orange-400/10 border border-orange-400/20'
        }`}>
          {message}
        </div>
      )}

      {/* Keyboard */}
      <div className="flex flex-col gap-1 w-full mt-2">
        {keyboardRows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1">
            {row.map((key) => {
              const status = keyStatuses[key] || 'unused';
              const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
              return (
                <button
                  key={key}
                  onClick={() => handleKeyInput(key)}
                  className={`flex items-center justify-center font-bold uppercase rounded-md text-[10px] sm:text-xs transition-all cursor-pointer ${
                    isSpecial ? 'px-2 py-3 bg-slate-700 text-white border border-slate-600 flex-1' : 'w-7 h-10 border'
                  } ${isSpecial ? 'hover:bg-slate-600' : getBgClass(status)}`}
                  style={!isSpecial ? { flexGrow: 1, minWidth: '20px', maxWidth: '36px' } : {}}
                >
                  {key === 'BACKSPACE' ? '⌫' : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Overlays */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 rounded-xl z-20 p-6">
          <h4 className={`text-2xl font-bold mb-2 ${won ? 'gradient-text' : 'text-red-400'}`}>
            {won ? '🎉 You Won!' : '💀 Out of Guesses'}
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            {won ? 'Congratulations, you guessed the word!' : `The word was ${solution}`}
          </p>
          <Button onClick={startNewGame} className="bg-neon-blue hover:bg-neon-blue/80 gap-2">
            <RotateCcw className="h-4 w-4" /> Play Again
          </Button>
        </div>
      )}
    </div>
  );
}
