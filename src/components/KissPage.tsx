import { useState, useEffect, useRef } from 'react';
import FloatingHearts from './FloatingHearts';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

interface KissPageProps {
  onComplete: () => void;
}

interface Kiss {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

const KissPage = ({ onComplete }: KissPageProps) => {
  const [kisses, setKisses] = useState<Kiss[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fade in audio
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

  // Fade out audio
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
    // 💋 Kiss animation logic
    const interval = setInterval(() => {
      const newKiss: Kiss = {
        id: Date.now() + Math.random(),
        x: Math.random() * 90 + 5,
        y: Math.random() * 80 + 10,
        size: Math.random() * 80 + 50,
        duration: Math.random() * 2 + 2,
      };

      setKisses(prev => [...prev, newKiss]);

      setTimeout(() => {
        setKisses(prev => prev.filter(k => k.id !== newKiss.id));
      }, newKiss.duration * 1000);
    }, 250);

    // 🎵 Audio setup
    audioRef.current = new Audio(`${import.meta.env.BASE_URL}kisssound.ogg`);
    



    audioRef.current.loop = true;


    
    const startAudio = async () => {
      try {
        await audioRef.current?.play();
        fadeIn(audioRef.current!, 2500, 0.25);
      } catch {
        // autoplay blocked until user interaction
      }

      window.removeEventListener('click', startAudio);
    };

    window.addEventListener('click', startAudio);
    startAudio();

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', startAudio);

      if (audioRef.current) {
        fadeOut(audioRef.current, 1200);
        audioRef.current.pause(); 
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen romantic-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FloatingHearts />

      {/* 🔊 Sound indicator */}
      <div className="absolute top-6 z-20 flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
        <Volume2 className="w-4 h-4" />
        <span>Turn your sound on 🎧</span>
      </div>

      <h1 className="font-script text-4xl md:text-5xl text-romantic mb-8 z-10 text-center animate-fade-in">
        Kisses Everywhere! 💋
      </h1>

      {/* Animated lips */}
      {kisses.map(k => (
        <span
          key={k.id}
          className="absolute"
          style={{
            left: `${k.x}%`,
            top: `${k.y}%`,
            fontSize: `${k.size}px`,
            transform: `scale(0)`,
            animation: `floatKiss ${k.duration}s forwards ease-out`,
            zIndex: 5,
          }}
        >
          💋
        </span>
      ))}

      <div className="mt-8 z-10">
        <Button
          onClick={onComplete}
          className="love-gradient text-primary-foreground px-8 py-6 text-lg rounded-2xl animate-pulse"
        >
          Continue
        </Button>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes floatKiss {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          30% {
            transform: scale(1.3);
            opacity: 1;
          }
          100% {
            transform: scale(1)
              translateY(-150px)
              translateX(${Math.random() * 30 - 15}px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default KissPage;
