import { useEffect, useRef } from 'react';
import { Heart, Star, ArrowRight, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingHearts from './FloatingHearts';

interface LoveMessageProps {
  onNext: () => void;
}

const LoveMessage = ({ onNext }: LoveMessageProps) => {
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
    //audioRef.current = new Audio('/diewithasmile.mp3');
    audioRef.current = new Audio(`${import.meta.env.BASE_URL}diewithasmile.mp3`);
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
      window.removeEventListener('click', startAudio);
      if (audioRef.current) {
        fadeOut(audioRef.current, 1200);
        audioRef.current.pause(); 
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen romantic-bg flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingHearts />

      {/* 🔊 Sound indicator */}
      <div className="absolute top-6 z-20 flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
        <Volume2 className="w-4 h-4" />
        <span>Turn your sound on 🎧</span>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="bg-card/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl animate-fade-in">

          <div className="flex justify-center mb-6">
            <div className="relative">
              <Heart className="w-20 h-20 text-accent fill-accent heart-pulse glow-heart" />
              <Star className="absolute -top-2 -right-2 w-6 h-6 text-gold fill-gold sparkle" />
              <Sparkles
                className="absolute -bottom-1 -left-3 w-5 h-5 text-gold sparkle"
                style={{ animationDelay: '0.3s' }}
              />
            </div>
          </div>

          <h1 className="font-script text-4xl md:text-6xl text-center text-romantic mb-6">
            To My Beautiful Love
          </h1>

          <div className="space-y-4 text-center text-foreground/80 leading-relaxed">
            <p className="text-lg">
              Every moment with you feels like a beautiful dream I never want to wake up from.
              Your smile lights up my darkest days, and your love makes everything feel possible.
            </p>

            <p className="text-lg">
              You're not just my partner, you're my best friend, my confidant,
              and the most amazing person I've ever known.
            </p>

            <p className="text-lg">
              I fall more in love with you every single day.
              Forgive Me For All The Days I Failed You, Days I Couldn't Be There For You. I Promise To Be Better.
              Thank you for choosing me, for loving me, and for being you.
            </p>

            <div className="py-4">
              <Heart className="w-8 h-8 text-primary mx-auto fill-primary/50" />
            </div>

            <p className="font-script text-3xl text-romantic">
              Dina Tesfaye Kiros I Love You More Than Words Can Say
            </p>

            <p className="text-muted-foreground italic">
              Forever and always, yours baby ❤️
            </p>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={onNext}
              className="love-gradient text-primary-foreground px-8 py-6 text-lg rounded-2xl"
            >
              See Our Memories
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoveMessage;
