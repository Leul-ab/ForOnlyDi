import { useState } from 'react';
import { Heart, Lock, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FloatingHearts from './FloatingHearts';

interface PasswordPageProps {
  onSuccess: () => void;
}

const PasswordPage = ({ onSuccess }: PasswordPageProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '27122025') {
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen romantic-bg flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingHearts />
      
      <div className={`relative z-10 bg-card/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl max-w-md w-full animate-scale-in ${shake ? 'animate-shake' : ''}`}>
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Heart className="w-20 h-20 text-accent fill-accent heart-pulse glow-heart" />
            <Lock className="w-8 h-8 text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
        
        <h1 className="font-script text-4xl md:text-5xl text-center text-romantic mb-2">
          Hello, My Love
        </h1>
        
        <p className="text-center text-muted-foreground mb-8 font-body">
          Enter our special date to unlock
          <Sparkles className="inline w-4 h-4 ml-1 text-gold" />
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
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
              } focus:border-primary transition-all rounded-2xl`}
            />
          </div>
          
          {error && (
            <p className="text-accent text-center text-sm animate-fade-in">
              That's not quite right, try again my love 💕
            </p>
          )}
          
          <Button
            type="submit"
            className="w-full py-6 text-lg font-semibold rounded-2xl love-gradient text-primary-foreground hover:opacity-90 transition-all animate-pulse-glow"
          >
            <Heart className="w-5 h-5 mr-2 fill-current" />
            Unlock My Heart
          </Button>
        </form>
        
        <p className="text-center text-muted-foreground/60 text-sm mt-6">
          Hint: The day we became us 💑
        </p>
      </div>
    </div>
  );
};

export default PasswordPage;
