import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Heart, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoRainProps {
  onNext: () => void;
}

// Photos from /public/us
const photos = [
  '/us/IMG_0215.PNG',
  '/us/IMG_0216.JPG',
  '/us/laaa.jpg',
  '/us/IMG_0218.JPG',
  '/us/IMG_0219.JPG',
  '/us/IMG_0220.PNG',
  '/us/IMG_9208.JPG',
];

interface FallingPhoto {
  id: number;
  src: string;
  left: number;
  delay: number;
  duration: number;
  rotation: number;
}

const PhotoRain = ({ onNext }: PhotoRainProps) => {
  const [fallingPhotos, setFallingPhotos] = useState<FallingPhoto[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Smooth fade-in
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

  // Smooth fade-out
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
    // Create falling photos
    const newPhotos: FallingPhoto[] = [];
    for (let i = 0; i < 20; i++) {
      newPhotos.push({
        id: i,
        src: photos[i % photos.length],
        left: Math.random() * 90 + 5,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 4,
        rotation: Math.random() * 30 - 15,
      });
    }
    setFallingPhotos(newPhotos);

    // Setup ambient audio
    audioRef.current = new Audio('/missyouso.mp3');
    audioRef.current.loop = true;

    const playAudio = async () => {
      try {
        await audioRef.current?.play();
        fadeIn(audioRef.current!, 2500, 0.25);
      } catch {
        // Autoplay blocked — indicator will guide user
      }
    };

    playAudio();

    return () => {
      if (audioRef.current) {
        fadeOut(audioRef.current, 1200);
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen romantic-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Falling photos */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {fallingPhotos.map((photo) => (
          <div
            key={photo.id}
            className="absolute animate-photo-fall"
            style={{
              left: `${photo.left}%`,
              top: '-150px',
              animationDelay: `${photo.delay}s`,
              animationDuration: `${photo.duration}s`,
            }}
          >
            <div
              className="w-24 h-24 md:w-32 md:h-32 rounded-lg shadow-lg overflow-hidden border-4 border-card bg-card"
              style={{ transform: `rotate(${photo.rotation}deg)` }}
            >
              <img
                src={photo.src}
                alt="Memory"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center animate-fade-in">
        <div className="bg-card/90 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl">

          {/* Sound indicator */}
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-muted-foreground animate-pulse">
            <Volume2 className="w-4 h-4" />
            <span>Turn your sound on 🎧</span>
          </div>

          <Heart className="w-16 h-16 text-accent fill-accent mx-auto mb-4 heart-pulse" />

          <h1 className="font-script text-4xl md:text-5xl text-romantic mb-4">
            Our Beautiful Memories
          </h1>

          <p className="text-muted-foreground mb-8 max-w-md">
            Every photo tells a story of us,  
            every moment a treasure I hold dear.
          </p>

          <Button
            onClick={onNext}
            className="love-gradient text-primary-foreground px-8 py-6 text-lg rounded-2xl"
          >
            One More Thing...
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

        </div>
      </div>
    </div>
  );
};

export default PhotoRain;
