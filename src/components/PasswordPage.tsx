import { useState, useEffect } from 'react';
import { Heart, Lock, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FloatingHearts from './FloatingHearts';
//import { preloadAudio } from '@/lib/preload';
import { preloadAudio, preloadImage } from '@/lib/preload';

interface PasswordPageProps {
  onSuccess: () => void;
}










/* 💕 Heart Rain */
const HeartRain = () => {
  const [hearts, setHearts] = useState<any[]>([]);
  const emojis = ['❤️', '💖', '💕', '💗', '💓', '💘'];

  useEffect(() => {
    const interval = setInterval(() => {
      const heart = {
        id: Math.random(),
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100,
        size: 20 + Math.random() * 50,
        duration: 4 + Math.random() * 3,
      };

      setHearts((h) => [...h, heart]);

      setTimeout(
        () => setHearts((h) => h.filter((x) => x.id !== heart.id)),
        heart.duration * 1000
      );
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute animate-heart-fall"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            animationDuration: `${h.duration}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}

      <style>{`
        @keyframes heartFall {
          0% { transform: translateY(-10vh); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        .animate-heart-fall {
          animation: heartFall linear forwards;
        }
      `}</style>
    </div>
  );
};

/* 💔 Burst when password is wrong */
const HeartBurst = ({ trigger }: { trigger: number }) => {
  const emojis = ['💔', '💥'];

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {[...Array(14)].map((_, i) => {
        const angle = Math.random() * 2 * Math.PI;
        const distance = 60 + Math.random() * 80;

        return (
          <span
            key={`${trigger}-${i}`}
            className="absolute left-1/2 top-[58%] animate-burst"
            style={{
              transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          >
            {emojis[Math.floor(Math.random() * emojis.length)]}
          </span>
        );
      })}

      <style>{`
        @keyframes burst {
          0% {
            transform: translate(-50%, -50%) scale(0.6);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        .animate-burst {
          animation: burst 900ms ease-out forwards;
          font-size: 50px;
        }
      `}</style>
    </div>
  );
};

const PasswordPage = ({ onSuccess }: PasswordPageProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
   
  useEffect(() => {
  const base = import.meta.env.BASE_URL;

  // preload everything
  preloadAudio(`${base}kisssound.mp3`);
  preloadAudio(`${base}diewithasmile.mp3`);
  preloadAudio(`${base}missyouso.mp3`);
  preloadAudio(`${base}bruno-mars.mp3`);

  const photos = [
    `${base}us/IMG_0215.PNG`,
    `${base}us/IMG_0216.JPG`,
    `${base}us/laaa.jpg`,
    `${base}us/IMG_0218.JPG`,
    `${base}us/IMG_0219.JPG`,
    `${base}us/IMG_0220.PNG`,
    //`${base}us/IMG_9208.JPG`,
    `${base}us/IMG_0224.PNG`,
  ];

  photos.forEach(preloadImage);
  preloadImage(`${base}redrose.gif`);
}, []);





  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === '27122025') {
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setBurstKey((k) => k + 1);

      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen romantic-bg flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingHearts />
      <HeartRain />

      {error && <HeartBurst trigger={burstKey} />}

      <div
        className={`relative z-10 bg-card/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl max-w-md w-full animate-scale-in ${
          shake ? 'animate-shake' : ''
        }`}
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Heart className="w-20 h-20 text-accent fill-accent heart-pulse glow-heart" />
            <Lock className="w-8 h-8 text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        <h1 className="font-script text-4xl md:text-5xl text-center text-romantic mb-2">
          Hello, My Love
        </h1>

        <p className="text-center text-muted-foreground mb-8">
          Enter our special date to unlock
          <Sparkles className="inline w-4 h-4 ml-1 text-gold" />
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Enter our anniversary..."
            className={`text-center text-lg py-6 bg-secondary/50 border-2 ${
              error ? 'border-accent' : 'border-primary/30'
            } rounded-2xl`}
          />

          {error && (
            <p className="text-accent text-center text-sm animate-fade-in">
              Oops… try again, my love 💔
            </p>
          )}

          <Button className="w-full py-6 text-lg rounded-2xl love-gradient">
            <Heart className="w-5 h-5 mr-2 fill-current" />
            Unlock My Heart
          </Button>
        </form>

        <p className="text-center text-muted-foreground/60 text-sm mt-6">
          Hint: The day we became us
        </p>
      </div>
    </div>
  );
};


export default PasswordPage;
