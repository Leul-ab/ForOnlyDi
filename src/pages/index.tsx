import { useState } from 'react';
import PasswordPage from '@/components/PasswordPage';
import HeartFilling from '@/components/HeartFilling';
import KissPage from '@/components/KissPage';
import LoveMessage from '@/components/LoveMessage';
import PhotoRain from '@/components/PhotoRain';
import ValentineProposal from '@/components/ValentineProposal';
import RoseGift from '@/components/RoseGift'; // new rose gift page

type Page =
  | 'password'
  | 'heart'
  | 'kiss'
  | 'message'
  | 'photos'
  | 'valentine'
  | 'rose'
  | 'done';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('password');

  const renderPage = () => {
    switch (currentPage) {
      case 'password':
        return <PasswordPage onSuccess={() => setCurrentPage('heart')} />;
      case 'heart':
        return <HeartFilling onComplete={() => setCurrentPage('kiss')} />;
      case 'kiss':
        return <KissPage onComplete={() => setCurrentPage('message')} />;
      case 'message':
        return <LoveMessage onNext={() => setCurrentPage('photos')} />;
      case 'photos':
        return <PhotoRain onNext={() => setCurrentPage('valentine')} />;
      case 'valentine':
        return <ValentineProposal onComplete={() => setCurrentPage('rose')} />;
      case 'rose':
        return <RoseGift onComplete={() => setCurrentPage('done')} />;
      case 'done':
        return (
          <div className="min-h-screen romantic-bg flex items-center justify-center p-4">
            <h1 className="font-script text-5xl text-romantic text-center">
              💖 All Done! Happy Valentine’s Day! 💖
            </h1>
          </div>
        );
      default:
        return <PasswordPage onSuccess={() => setCurrentPage('heart')} />;
    }
  };

  return <main className="min-h-screen">{renderPage()}</main>;
};

export default Index;
