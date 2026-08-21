import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // High-energy electronic royalty-free track for the runner background
  const audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4; // Set a reasonable background volume
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => console.error("Audio playback failed", err));
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} src={audioUrl} loop preload="auto" />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        className={`flex items-center gap-2 px-4 py-3 rounded-full font-black uppercase text-xs italic shadow-lg border backdrop-blur-md transition-all ${
          isPlaying 
            ? 'bg-[#CCFF00]/20 border-[#CCFF00] text-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.3)]' 
            : 'bg-black/50 border-white/20 text-gray-400 hover:text-white'
        }`}
      >
        {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
        {isPlaying ? 'Beats: ON' : 'Beats: OFF'}
      </motion.button>
    </div>
  );
}
