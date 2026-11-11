import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AudioPlayerProps {
  text: string;
  langCode?: 'en' | 'kn' | 'hi';
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, langCode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { language, t } = useLanguage();
  const targetLang = langCode || language;

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Map to BCP 47 language tags
    const langTags: Record<string, string> = {
      en: 'en-IN',
      kn: 'kn-IN',
      hi: 'hi-IN'
    };
    utterance.lang = langTags[targetLang] || 'en-IN';
    utterance.rate = 0.9; // slightly slower for clearer comprehension

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <button
      onClick={toggleSpeech}
      className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
        isPlaying
          ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
          : 'bg-agri-50 text-agri-800 border border-agri-200 hover:bg-agri-100'
      }`}
      title={isPlaying ? t.actions.stopAudio : t.actions.readAloud}
      type="button"
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-4 h-4 text-amber-600" />
          <span>{t.actions.stopAudio}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-agri-600" />
          <span>{t.actions.readAloud}</span>
        </>
      )}
    </button>
  );
};

