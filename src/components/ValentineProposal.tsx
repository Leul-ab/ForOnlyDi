import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import FloatingHearts from './FloatingHearts';
import { Button } from '@/components/ui/button';

interface ValentineProposalProps {
  onComplete: () => void; // goes to the RoseGift page
}

/* 💖 Heart Rain Background */
const HeartRain = () => {
  const [hearts, setHearts] = useState<any[]>([]);
  const emojis = ['❤️', '💖', '💕', '💗', '💓', '💘'];

  useEffect(() => {
    const interval = setInterval(() => {
      const heart = {
        id: Math.random(),
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100,
        size: 30 + Math.random() * 50,
        duration: 4 + Math.random() * 3,
      };

      setHearts(prev => [...prev, heart]);

      setTimeout(
        () => setHearts(prev => prev.filter(h => h.id !== heart.id)),
        heart.duration * 1000
      );
    }, 400); // frequency of heart drops

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map(h => (
        <span
          key={h.id}
          className="absolute animate-heart-fall select-none"
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
          animation-name: heartFall;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

const ValentineProposal = ({ onComplete }: ValentineProposalProps) => {
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleYes = () => {
    setHasAnswered(true);
  };

  const yesVariants = [
    'Yes! 💕',
    'Absolutely Yes!',
    'Yes Yes Yes!',
    'Of Course Yes!',
    '100% Yes!',
    'Forever Yes!',
  ];

  return (
    <div className="min-h-screen romantic-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <FloatingHearts />
      <HeartRain />

      <div className="relative z-10 max-w-lg w-full">
        {!hasAnswered ? (
          /* ---------------- QUESTION CARD ---------------- */
          <div className="bg-card/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl text-center animate-scale-in">
            <div className="relative mb-6">
              <Heart className="w-24 h-24 text-accent fill-accent mx-auto heart-pulse glow-heart" />
            </div>

            <h1 className="font-script text-4xl md:text-5xl text-romantic mb-4">
              Will You Be My Valentine?
            </h1>

            <p className="text-muted-foreground mb-8">
              I promise to love you, cherish you, and make you smile every day 
            </p>

            <div className="grid grid-cols-2 gap-4">
              {yesVariants.map((text, index) => (
                <Button
                  key={index}
                  onClick={handleYes}
                  className="love-gradient text-primary-foreground py-6 text-lg rounded-2xl hover:scale-105 transition-transform"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {text}
                </Button>
              ))}
            </div>

            <p className="text-muted-foreground/50 text-sm mt-6 italic">
              (There’s only one answer anyway 💕)
            </p>
          </div>
        ) : (
          /* ---------------- YES / CONTINUE ---------------- */
          <div className="bg-card/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl text-center animate-scale-in relative">
            <div className="relative mb-6">
              <Heart className="w-32 h-32 text-accent fill-accent mx-auto heart-pulse glow-heart" />
            </div>

            <h1 className="font-script text-5xl md:text-6xl text-romantic mb-4">
              Yay! 🎉
            </h1>

            <p className="text-xl text-foreground/80 mb-4">
              You just made me the happiest person alive!
            </p>

            <p className="text-muted-foreground mb-6">
              I knew you’d say yes because we’re meant to be together forever 💕
            </p>

            <Button
              onClick={onComplete} // now goes to the animated rose page
              className="love-gradient text-primary-foreground px-8 py-6 text-lg rounded-2xl hover:scale-105 transition"
            >
              One Last Gift 🎁
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValentineProposal;
