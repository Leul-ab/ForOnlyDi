import { useState, useCallback, useEffect, useRef } from 'react';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingHearts from './FloatingHearts';

interface HeartFillingProps {
  onComplete: () => void;
}

const HeartFilling = ({ onComplete }: HeartFillingProps) => {
  const maxFill = 100;
  const fillPerTap = 3; // How much each tap fills
  const decaySpeed = 0.2; // How fast the heart decays when idle
  const decayDelay = 300; // ms before decay starts

  const [fillLevel, setFillLevel] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(Date.now());
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isFull, setIsFull] = useState(false);

  const frameRef = useRef<number>();

  /* ---------------- TAP HANDLER ---------------- */
  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isFull) return;

    setFillLevel(prev => {
      const next = Math.min(prev + fillPerTap, maxFill);
      if (next >= maxFill) setIsFull(true);
      return next;
    });

    setLastTapTime(Date.now());

    // Sparkle effect
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const sparkle = { id: Date.now(), x, y };
    setSparkles(prev => [...prev, sparkle]);
    setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== sparkle.id)), 600);
  }, [isFull]);

  /* ---------------- LOVE DECAY ---------------- */
  useEffect(() => {
    const decay = () => {
      const now = Date.now();
      const idleTime = now - lastTapTime;

      if (!isFull && idleTime > decayDelay) {
        setFillLevel(prev => Math.max(prev - decaySpeed, 0));
      }

      frameRef.current = requestAnimationFrame(decay);
    };

    frameRef.current = requestAnimationFrame(decay);
    return () => cancelAnimationFrame(frameRef.current!);
  }, [lastTapTime, isFull]);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen romantic-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FloatingHearts />

      <div className="relative z-10 text-center mb-8 animate-fade-in">
        <h1 className="font-script text-4xl md:text-5xl text-romantic mb-2">
          Fill My Heart With Love
        </h1>
        <p className="text-muted-foreground">
          Don’t stop tapping… or the love fades 💔
        </p>
      </div>

      <div className="relative z-10">
        <div
          className="relative cursor-pointer select-none animate-scale-in"
          onClick={handleTap}
          onTouchStart={handleTap}
        >
          {/* Background heart */}
          <Heart className="w-64 h-64 md:w-80 md:h-80 text-rose-medium/30 stroke-[1.5]" />

          {/* Filled heart */}
          <div 
            className="absolute inset-0 overflow-hidden transition-[clip-path] duration-200 ease-out"
            style={{ clipPath: `inset(${100 - fillLevel}% 0 0 0)` }}
          >
            <Heart 
              className="w-64 h-64 md:w-80 md:h-80 text-accent fill-accent glow-heart transition-[filter] duration-200 ease-out" 
              style={{
                filter: `drop-shadow(0 0 ${20 + fillLevel / 1.5}px hsl(var(--accent) / ${0.3 + fillLevel / 150}))`
              }}
            />
          </div>

          {/* Sparkles */}
          {sparkles.map(s => (
            <Sparkles
              key={s.id}
              className="absolute w-6 h-6 text-gold animate-ping transition-opacity duration-300 pointer-events-none"
              style={{ left: s.x - 12, top: s.y - 12 }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-6 text-center">
          <div className="w-48 h-2 bg-rose-light rounded-full mx-auto overflow-hidden">
            <div
              className="h-full love-gradient transition-all duration-200 rounded-full"
              style={{ width: `${fillLevel}%` }}
            />
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            {Math.round(fillLevel)}% filled with love
          </p>
        </div>

        {/* Continue button only appears when full */}
        {isFull && (
          <div className="mt-6 text-center">
            <Button
              onClick={onComplete}
              className="love-gradient text-primary-foreground px-8 py-6 text-lg rounded-2xl hover:scale-105 transition"
            >
              Continue <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeartFilling;
