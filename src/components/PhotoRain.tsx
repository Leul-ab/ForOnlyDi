import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Heart, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPreloadedAudio } from '@/lib/preload';

interface PhotoRainProps {
  onNext: () => void;
}

const photos = [
  `${import.meta.env.BASE_URL}us/IMG_0215.PNG`,
  `${import.meta.env.BASE_URL}us/IMG_0216.JPG`,
  `${import.meta.env.BASE_URL}us/laaa.jpg`,
  `${import.meta.env.BASE_URL}us/IMG_0218.JPG`,
  `${import.meta.env.BASE_URL}us/IMG_0219.JPG`,
  `${import.meta.env.BASE_URL}us/IMG_0220.PNG`,
  //`${import.meta.env.BASE_URL}us/IMG_9208.JPG`,
  `${import.meta.env.BASE_URL}us/IMG_0224.PNG`,
];

interface FallingPhoto {
  id: number;
  src: string;
  left: number;
  delay: number;
  duration: number;
  rotation: number;
  size: number;
}

const PhotoRain = ({ onNext }: PhotoRainProps) => {
  const [fallingPhotos, setFallingPhotos] = useState<FallingPhoto[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fadeIn = (audio: HTMLAudioElement, duration = 2500, targetVolume = 0.25) => {
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
    const newPhotos: FallingPhoto[] = [];
    for (let i = 0; i < 20; i++) {
      newPhotos.push({
        id: i,
        src: photos[i % photos.length],
        left: Math.random() * 90, // Keep slightly away from extreme edges
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 7,
        rotation: Math.random() * 40 - 20,
        size: 100 + Math.random() * 60, // Randomized sizes for depth
      });
    }
    setFallingPhotos(newPhotos);

    const src = `${import.meta.env.BASE_URL}missyouso.mp3`;
    audioRef.current = getPreloadedAudio(src) || new Audio(src);
    if (audioRef.current) {
      audioRef.current.loop = true;
    }

    const playAudio = async () => {
      try {
        await audioRef.current?.play();
        fadeIn(audioRef.current!, 2500, 0.25);
      } catch (e) {
        console.log("Autoplay blocked");
      }
    };

    playAudio();

    return () => {
      if (audioRef.current) {
        fadeOut(audioRef.current, 1200);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full romantic-bg overflow-hidden flex flex-col">
      {/* Background Layer: Falling photos */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {fallingPhotos.map((photo) => (
          <div
            key={photo.id}
            className="absolute animate-photo-fall opacity-80"
            style={{
              left: `${photo.left}%`,
              top: '-200px',
              animationDelay: `${photo.delay}s`,
              animationDuration: `${photo.duration}s`,
            }}
          >
            <div
              className="rounded-xl shadow-2xl overflow-hidden border-2 border-white/30 bg-white/10 backdrop-blur-[2px]"
              style={{ 
                transform: `rotate(${photo.rotation}deg)`,
                width: `${photo.size}px`,
                height: `${photo.size}px`
              }}
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

      {/* Foreground Layer: UI Content */}
      <div className="relative z-10 flex flex-col justify-between items-center min-h-screen w-full p-6 pointer-events-none">
        
        {/* Top: Branding/Icon */}
        <div className="mt-16 animate-pulse">
          <Heart className="w-14 h-14 text-white fill-accent drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
        </div>

        {/* Middle: Open space for photos to be seen */}
        <div className="flex-grow" />

        {/* Bottom: Information Card */}
        <div className="w-full max-w-sm mb-12 pointer-events-auto">
          <div className="bg-white/20 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 text-center shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-4 text-[10px] uppercase tracking-[0.2em] text-white/60">
              <Volume2 className="w-4 h-4" />
        <span>Turn your sound on 🎧</span>
            </div>

            <h1 className="font-script text-4xl md:text-5xl text-romantic mb-4">
              Our Beautiful Memories
            </h1>

            <p className="text-white/80 text-sm mb-8 font-light leading-relaxed px-4">
              Every photo tells a story of us, <br />
              a treasure I hold close to my heart.
            </p>

            <Button
              onClick={onNext}
              className="w-full love-gradient text-white py-7 text-lg rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.2)] active:scale-95 transition-all duration-300 flex items-center justify-center"
            >
              One More Thing...
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Vignette to help text readability */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-5" />
    </div>
  );
};

export default PhotoRain;