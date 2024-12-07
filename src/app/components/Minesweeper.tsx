import { useState, useEffect } from 'react';

type CellValue = number | '💣' | '🚩';
type CellState = 'hidden' | 'revealed' | 'flagged';

interface Cell {
  value: CellValue;
  state: CellState;
}

interface MinesweeperProps {
  width?: number;
  height?: number;
  mines?: number;
  onClose: () => void;
  onMinimize: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

const Minesweeper = ({ 
  width = 9, 
  height = 9, 
  mines = 10,
  onClose,
  onMinimize,
  onMouseDown 
}: MinesweeperProps) => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [firstClick, setFirstClick] = useState(true);
  const [mineCount, setMineCount] = useState(mines);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Initialize board
  const initializeBoard = (): Cell[][] => {
    const newBoard: Cell[][] = [];
    for (let i = 0; i < height; i++) {
      newBoard.push([]);
      for (let j = 0; j < width; j++) {
        newBoard[i].push({
          value: 0,
          state: 'hidden'
        });
      }
    }
    return newBoard;
  };

  // Place mines and calculate numbers
  const placeMines = (board: Cell[][], firstX: number, firstY: number) => {
    let minesPlaced = 0;
    const newBoard = [...board];

    while (minesPlaced < mines) {
      const x = Math.floor(Math.random() * height);
      const y = Math.floor(Math.random() * width);

      // Don't place mine on first click or where mine already exists
      if ((x !== firstX || y !== firstY) && newBoard[x][y].value !== '💣') {
        newBoard[x][y].value = '💣';
        minesPlaced++;

        // Update numbers around mine
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (x + i >= 0 && x + i < height && y + j >= 0 && y + j < width) {
              if (newBoard[x + i][y + j].value !== '💣') {
                newBoard[x + i][y + j].value = (newBoard[x + i][y + j].value as number) + 1;
              }
            }
          }
        }
      }
    }
    return newBoard;
  };

  // Reveal cells recursively
  const revealCell = (x: number, y: number, currentBoard: Cell[][]) => {
    if (
      x < 0 || x >= height || y < 0 || y >= width ||
      currentBoard[x][y].state === 'revealed' ||
      currentBoard[x][y].state === 'flagged'
    ) {
      return currentBoard;
    }

    const newBoard = [...currentBoard];
    newBoard[x][y].state = 'revealed';

    if (newBoard[x][y].value === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          revealCell(x + i, y + j, newBoard);
        }
      }
    }

    return newBoard;
  };

  // Handle cell click
  const handleCellClick = (x: number, y: number) => {
    if (gameOver || gameWon || board[x][y].state === 'flagged') return;

    let newBoard = [...board];

    if (firstClick) {
      setFirstClick(false);
      setTimerActive(true);
      newBoard = placeMines(newBoard, x, y);
    }

    if (newBoard[x][y].value === '💣') {
      // Game Over
      setGameOver(true);
      setTimerActive(false);
      newBoard = newBoard.map(row => row.map(cell => ({
        ...cell,
        state: cell.value === '💣' ? 'revealed' : cell.state
      })));
    } else {
      newBoard = revealCell(x, y, newBoard);
    }

    setBoard(newBoard);
    checkWinCondition(newBoard);
  };

  // Handle right click (flag)
  const handleRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    if (gameOver || gameWon || board[x][y].state === 'revealed') return;

    const newBoard = [...board];
    if (board[x][y].state === 'hidden') {
      newBoard[x][y].state = 'flagged';
      setMineCount(prev => prev - 1);
    } else if (board[x][y].state === 'flagged') {
      newBoard[x][y].state = 'hidden';
      setMineCount(prev => prev + 1);
    }
    setBoard(newBoard);
  };

  // Check win condition
  const checkWinCondition = (currentBoard: Cell[][]) => {
    const won = currentBoard.every(row =>
      row.every(cell =>
        (cell.value === '💣' && cell.state !== 'revealed') ||
        (cell.value !== '💣' && cell.state === 'revealed')
      )
    );
    if (won) {
      setGameWon(true);
      setTimerActive(false);
    }
  };

  // Reset game
  const resetGame = () => {
    setBoard(initializeBoard());
    setGameOver(false);
    setGameWon(false);
    setFirstClick(true);
    setMineCount(mines);
    setTime(0);
    setTimerActive(false);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Initialize board on mount
  useEffect(() => {
    setBoard(initializeBoard());
  }, []);

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
          <div className="win98-button px-2 py-1">💣 {mineCount}</div>
          <button
            className="win98-button px-4 py-1"
            onClick={resetGame}
          >
            {gameOver ? '😵' : gameWon ? '😎' : '🙂'}
          </button>
          <div className="win98-button px-2 py-1">⏰ {time}</div>
        </div>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}>
          {board.map((row, x) =>
            row.map((cell, y) => (
              <button
                key={`${x}-${y}`}
                className={`win98-button w-8 h-8 flex items-center justify-center text-sm
                  ${cell.state === 'revealed' ? 'active' : ''}`}
                onClick={() => handleCellClick(x, y)}
                onContextMenu={(e) => handleRightClick(e, x, y)}
                disabled={gameOver || gameWon}
              >
                {cell.state === 'revealed'
                  ? cell.value === 0
                    ? ''
                    : cell.value
                  : cell.state === 'flagged'
                    ? '🚩'
                    : ''}
              </button>
            ))
          )}
        </div>
        {(gameOver || gameWon) && (
          <div className="mt-4 text-center font-bold">
            {gameOver ? 'Game Over!' : 'You Win!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Minesweeper; 