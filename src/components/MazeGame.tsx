import { useState, useRef, useEffect } from 'react';
import { Heart, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingHearts from './FloatingHearts';

interface MazeGameProps {
  onComplete: () => void;
}

const MAZE_SIZE = 10;
const CELL_SIZE = 32;

// Simple maze layout: 0 = path, 1 = wall
const mazeLayout = [
  [0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
  [1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
];

const MazeGame = ({ onComplete }: MazeGameProps) => {
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const mazeRef = useRef<HTMLDivElement>(null);

  const goalPos = { x: 9, y: 9 };

  useEffect(() => {
    if (playerPos.x === goalPos.x && playerPos.y === goalPos.y) {
      setHasWon(true);
    }
  }, [playerPos]);

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !mazeRef.current || hasWon) return;

    const rect = mazeRef.current.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((clientY - rect.top) / CELL_SIZE);

    if (x >= 0 && x < MAZE_SIZE && y >= 0 && y < MAZE_SIZE) {
      // Check if it's a valid path and adjacent to current position
      const dx = Math.abs(x - playerPos.x);
      const dy = Math.abs(y - playerPos.y);
      
      if (mazeLayout[y][x] === 0 && dx + dy <= 1) {
        setPlayerPos({ x, y });
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  return (
    <div className="min-h-screen romantic-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FloatingHearts />
      
      <div className="relative z-10 text-center mb-6 animate-fade-in">
        <h1 className="font-script text-4xl md:text-5xl text-romantic mb-2">
          Find Your Way to Me
        </h1>
        <p className="text-muted-foreground">
          Drag through the maze to reach my heart 💕
        </p>
      </div>

      {!hasWon ? (
        <div
          ref={mazeRef}
          className="relative bg-card/80 backdrop-blur-lg rounded-2xl p-2 shadow-xl animate-scale-in cursor-pointer"
          style={{ width: MAZE_SIZE * CELL_SIZE + 16, height: MAZE_SIZE * CELL_SIZE + 16 }}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
        >
          {mazeLayout.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`absolute rounded-sm transition-colors ${
                  cell === 1
                    ? 'bg-rose-500'
                    : 'bg-rose-200'
                }`}
                style={{
                  left: x * CELL_SIZE + 8,
                  top: y * CELL_SIZE + 8,
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                }}
              />
            ))
          )}
          
          {/* Player */}
          <div
            className="absolute transition-all duration-150 ease-out z-10"
            style={{
              left: playerPos.x * CELL_SIZE + 8 + CELL_SIZE / 2 - 12,
              top: playerPos.y * CELL_SIZE + 8 + CELL_SIZE / 2 - 12,
            }}
          >
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg animate-bounce-soft">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>

          {/* Goal */}
          <div
            className="absolute z-10"
            style={{
              left: goalPos.x * CELL_SIZE + 8 + CELL_SIZE / 2 - 14,
              top: goalPos.y * CELL_SIZE + 8 + CELL_SIZE / 2 - 14,
            }}
          >
            <Heart className="w-7 h-7 text-accent fill-accent heart-pulse glow-heart" />
          </div>
        </div>
      ) : (
        <div className="bg-card/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl text-center animate-scale-in">
          <Heart className="w-24 h-24 text-accent fill-accent mx-auto mb-4 heart-pulse glow-heart" />
          <h2 className="font-script text-3xl text-romantic mb-4">
            You Found Me! 💕
          </h2>
          <p className="text-muted-foreground mb-6">
            Just like you always find your way to my heart
          </p>
          <Button
            onClick={onComplete}
            className="love-gradient text-primary-foreground px-8 py-6 text-lg rounded-2xl"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {!hasWon && (
        <p className="text-muted-foreground/60 text-sm mt-4 z-10">
          Hold and drag to move through the path
        </p>
      )}
    </div>
  );
};

export default MazeGame;
