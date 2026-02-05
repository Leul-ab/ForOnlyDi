import { useEffect, useRef } from "react";
import { Volume2 } from "lucide-react";
import FloatingHearts from "./FloatingHearts";

interface RoseGiftProps {
  onComplete: () => void;
}

const RoseGift = ({ onComplete }: RoseGiftProps) => {
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
    audioRef.current = new Audio(`${import.meta.env.BASE_URL}bruno-mars.mp3`);
    //audioRef.current = new Audio("/bruno-mars.mp3");
    audioRef.current.loop = true;

    const startAudio = async () => {
      try {
        await audioRef.current?.play();
        fadeIn(audioRef.current!, 2500, 0.25);
      } catch {
        // autoplay blocked until user interaction
      }

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

      <div className="z-10 animate-float">
        <img
          src={`${import.meta.env.BASE_URL}redrose.gif`}
          alt="Romantic Bouquet"
          className="w-64 md:w-80 drop-shadow-xl hover:scale-105 transition-transform duration-500"
        />

      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RoseGift;
