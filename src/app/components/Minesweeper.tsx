'use client';

import { useState, useEffect, useCallback } from 'react';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

interface MinesweeperProps {
  onClose: () => void;
  onMinimize: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

const Minesweeper = ({ onClose, onMinimize, onMouseDown }: MinesweeperProps) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [mineCount] = useState(10);
  const [flagCount, setFlagCount] = useState(0);
  const [face, setFace] = useState('🙂');
  const GRID_SIZE = 9;
  const [time, setTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const initializeGrid = useCallback(() => {
    // Create empty grid
    const newGrid: Cell[][] = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    );

    // Place mines randomly
    let minesToPlace = mineCount;
    while (minesToPlace > 0) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      if (!newGrid[x][y].isMine) {
        newGrid[x][y].isMine = true;
        minesToPlace--;
      }
    }

    // Calculate neighbor mines
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (!newGrid[i][j].isMine) {
          let count = 0;
          // Check all 8 neighbors
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              if (i + di >= 0 && i + di < GRID_SIZE && j + dj >= 0 && j + dj < GRID_SIZE) {
                if (newGrid[i + di][j + dj].isMine) count++;
              }
            }
          }
          newGrid[i][j].neighborMines = count;
        }
      }
    }

    return newGrid;
  }, [mineCount]);

  useEffect(() => {
    setGrid(initializeGrid());
  }, [initializeGrid]);

  useEffect(() => {
    return () => {
      // Cleanup timer on component unmount
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  const revealCell = (x: number, y: number) => {
    if (gameOver || gameWon || grid[x][y].isFlagged || grid[x][y].isRevealed) return;

    // Start timer on first click if not already running
    if (!timerInterval) {
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      setTimerInterval(interval);
    }

    const newGrid = [...grid];
    
    if (grid[x][y].isMine) {
      // Game Over
      setGameOver(true);
      setFace('😵');
      // Stop the timer
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      // Reveal all mines
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (newGrid[i][j].isMine) {
            newGrid[i][j].isRevealed = true;
          }
        }
      }
    } else {
      // Flood fill for empty cells
      const floodFill = (i: number, j: number) => {
        if (i < 0 || i >= GRID_SIZE || j < 0 || j >= GRID_SIZE) return;
        if (newGrid[i][j].isRevealed || newGrid[i][j].isFlagged) return;
        
        newGrid[i][j].isRevealed = true;
        
        if (newGrid[i][j].neighborMines === 0) {
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              floodFill(i + di, j + dj);
            }
          }
        }
      };

      floodFill(x, y);
    }

    setGrid(newGrid);
    checkWinCondition(newGrid);
  };

  const toggleFlag = (x: number, y: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (gameOver || gameWon || grid[x][y].isRevealed) return;

    const newGrid = [...grid];
    newGrid[x][y].isFlagged = !newGrid[x][y].isFlagged;
    setGrid(newGrid);
    setFlagCount(flagCount + (newGrid[x][y].isFlagged ? 1 : -1));
  };

  const checkWinCondition = (currentGrid: Cell[][]) => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (!currentGrid[i][j].isMine && !currentGrid[i][j].isRevealed) return;
      }
    }
    setGameWon(true);
    setFace('😎');
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const resetGame = () => {
    setGrid(initializeGrid());
    setGameOver(false);
    setGameWon(false);
    setFlagCount(0);
    setFace('🙂');
    setTime(0);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const getCellContent = (cell: Cell): string | number => {
    if (!cell.isRevealed) return cell.isFlagged ? '🚩' : '';
    if (cell.isMine) return '💣';
    return cell.neighborMines || '';
  };

  const getCellColor = (cell: Cell): string => {
    if (!cell.isRevealed) return '';
    if (cell.neighborMines === 1) return 'text-blue-600';
    if (cell.neighborMines === 2) return 'text-green-600';
    if (cell.neighborMines === 3) return 'text-red-600';
    if (cell.neighborMines === 4) return 'text-blue-900';
    if (cell.neighborMines === 5) return 'text-red-900';
    if (cell.neighborMines === 6) return 'text-teal-600';
    if (cell.neighborMines === 7) return 'text-black';
    if (cell.neighborMines === 8) return 'text-gray-600';
    return '';
  };

  return (
    <div className="win98-window">
      <div 
        className="win98-title-bar cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
      >
        <span>Minesweeper</span>
        <div className="flex gap-1">
          <button
            className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0"
            onClick={onMinimize}
          >
            _
          </button>
          <button
            className="win98-button h-[18px] w-[18px] flex items-center justify-center p-0"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>
      <div className="p-4 bg-[#c0c0c0]">
        <div className="flex justify-between items-center mb-4">
          <div className="win98-button px-2 py-1">
            💣 {mineCount - flagCount}
          </div>
          <button
            className="win98-button px-4 py-1 text-2xl leading-none"
            onClick={resetGame}
          >
            {face}
          </button>
          <div className="win98-button px-2 py-1">
            ⏱️ {time.toString().padStart(3, '0')}
          </div>
        </div>
        <div className="grid grid-cols-9 gap-1">
          {grid.map((row, i) =>
            row.map((cell, j) => (
              <button
                key={`${i}-${j}`}
                className={`win98-button w-8 h-8 flex items-center justify-center text-sm font-bold
                  ${cell.isRevealed ? 'active' : ''} ${getCellColor(cell)}`}
                onClick={() => revealCell(i, j)}
                onContextMenu={(e) => toggleFlag(i, j, e)}
                onMouseDown={() => setFace('😮')}
                onMouseUp={() => !gameOver && !gameWon && setFace('🙂')}
                onMouseLeave={() => !gameOver && !gameWon && setFace('🙂')}
              >
                {getCellContent(cell)}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Minesweeper; 