import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import FloatingHearts from "./FloatingHearts";

interface RoseGiftProps {
  onComplete: () => void;
}

interface Burst {
  id: number;
  x: number;
  y: number;
  symbol: string;
  dx: string;
  dy: string;
  rot: string;
  opacity: number;
  color: string;
}

const symbols = ["🌸", "🌺", "🌷", "💐", "🌹", "❤", "♥"];

const heartColors = [
  "#ff4d6d", // pink-red
  "#ff85a1", // soft pink
  "#ffb703", // gold
  "#9d4edd", // purple
  "#4cc9f0", // blue
  "#52b788", // green
];

const RoseGift = ({ onComplete }: RoseGiftProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const lastTapRef = useRef(0);

  /* 🔊 Fade in audio */
  const fadeIn = (
    audio: HTMLAudioElement,
    duration = 2500,
    targetVolume = 0.25
  ) => {
    audio.volume = 0;
    const step = targetVolume / (duration / 50);

    const fade = setInterval(() => {
      if (audio.volume < targetVolume) {
        audio.volume = Math.min(audio.volume + step, targetVolume);
      } else {
        clearInterval(fade);
      }
    }, 50);
  };

  /* 🌙 Fade out audio */
  const fadeOut = (audio: HTMLAudioElement, duration = 1200) => {
    const step = audio.volume / (duration / 50);

    const fade = setInterval(() => {
      if (audio.volume > 0) {
        audio.volume = Math.max(audio.volume - step, 0);
      } else {
        audio.pause();
        clearInterval(fade);
      }
    }, 50);
  };

  useEffect(() => {
    audioRef.current = new Audio(`${import.meta.env.BASE_URL}bruno-mars.mp3`);
    audioRef.current.loop = true;

    const startAudio = async () => {
      try {
        await audioRef.current?.play();
        fadeIn(audioRef.current!, 2500, 0.25);
      } catch {}
      window.removeEventListener("click", startAudio);
    };

    window.addEventListener("click", startAudio);
    startAudio();

    return () => {
      window.removeEventListener("click", startAudio);
      if (audioRef.current) {
        fadeOut(audioRef.current, 1200);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  /* 🌸💖 Smooth bloom (flowers + hearts) */
  const triggerBurst = (e: React.MouseEvent<HTMLImageElement>) => {
    const now = Date.now();

    // ⛔ throttle rapid taps
    if (now - lastTapRef.current < 220) return;
    lastTapRef.current = now;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const newBursts: Burst[] = Array.from({ length: 16 }).map((_, i) => {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const isHeart = symbol === "❤" || symbol === "♥";

      return {
        id: now + i,
        x,
        y,
        symbol,
        dx: `${Math.random() * 220 - 110}px`,
        dy: `${Math.random() * -240 - 120}px`,
        rot: `${Math.random() * 360}deg`,
        opacity: Math.random() * 0.25 + 0.35,
        color: isHeart
          ? heartColors[Math.floor(Math.random() * heartColors.length)]
          : "inherit",
      };
    });

    setBursts((prev) => [...prev, ...newBursts]);

    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => !newBursts.includes(b)));
    }, 1900);
  };

  return (
    <div className="min-h-screen romantic-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FloatingHearts />

      {/* 🔊 Sound indicator */}
      <div className="absolute top-6 z-20 flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
        <Volume2 className="w-4 h-4" />
        <span>Turn your sound on 🎧</span>
      </div>

      <h1 className="font-script text-5xl md:text-6xl text-romantic mb-8 z-10 text-center animate-fade-in">
        I LOVE YOU 🌸
      </h1>

      {/* 🌹 Rose */}
      <div className="z-10 animate-float">
        <img
          src={`${import.meta.env.BASE_URL}redrose.gif`}
          alt="Romantic Bouquet"
          onClick={triggerBurst}
          className="w-64 md:w-80 cursor-pointer drop-shadow-xl hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex items-center justify-center gap-2 mb-4 text-sm text-muted-foreground animate-pulse">
            
            <span>Tap</span>
          </div>

      {/* 🌸💖 Blooming symbols */}
      {bursts.map((b) => (
        <span
          key={b.id}
          className="flower-burst"
          style={{
            left: b.x,
            top: b.y,
            opacity: b.opacity,
            color: b.color,
            "--dx": b.dx,
            "--dy": b.dy,
            "--rot": b.rot,
          } as React.CSSProperties}
        >
          {b.symbol}
        </span>
      ))}

      {/* ✨ Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .flower-burst {
          position: fixed;
          font-size: 1.9rem;
          pointer-events: none;
          filter: blur(0.35px) drop-shadow(0 0 8px rgba(255,182,193,0.45));
          animation: bloom 1.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes bloom {
          0% {
            transform: translate(0, 0) scale(0.35) rotate(0deg);
            opacity: 0;
          }
          25% {
            opacity: 0.8;
          }
          70% {
            opacity: 0.6;
          }
          100% {
            transform: translate(var(--dx), var(--dy))
              scale(1.4)
              rotate(var(--rot));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RoseGift;
