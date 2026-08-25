import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Medal, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

import { Logo } from '../Logo';

export default function ARMedal() {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [showMedal, setShowMedal] = useState(false);

  useEffect(() => {
    // Start camera when component mounts
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        const videoElement = document.getElementById('camera-feed') as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = stream;
        }
        setCameraActive(true);
        
        // Delay showing medal to simulate scanning
        setTimeout(() => {
          setShowMedal(true);
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#CCFF00', '#FF007A', '#00F0FF', '#FFFF00']
          });
        }, 2000);

      } catch (err) {
        console.error("Camera access denied or unavailable", err);
        setCameraError(true);
        // Even if camera fails, show the medal after a delay against a dark background
        setTimeout(() => {
          setShowMedal(true);
        }, 1000);
      }
    };

    startCamera();

    return () => {
      // Cleanup camera
      const videoElement = document.getElementById('camera-feed') as HTMLVideoElement;
      if (videoElement && videoElement.srcObject) {
        const tracks = (videoElement.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      
      {/* Camera Feed Background */}
      {!cameraError && (
        <video 
          id="camera-feed" 
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
      )}

      {cameraError && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-gray-900 to-black opacity-80 flex flex-col items-center justify-center p-6 text-center">
          <Camera className="w-16 h-16 text-gray-700 mb-4" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Cámara no disponible. Mostrando medalla en entorno virtual.</p>
        </div>
      )}

      {/* AR UI Overlay */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10">
        <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 text-white">
          <div className="w-2 h-2 rounded-full bg-[#FF007A] animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-widest">AR Activo</span>
        </div>
        <Link to="/" className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/20">
          Cerrar
        </Link>
      </div>

      {/* Crosshair before medal appears */}
      {!showMedal && !cameraError && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
           <div className="w-64 h-64 border-2 border-[#00F0FF]/50 rounded-3xl relative animate-pulse">
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00F0FF] rounded-tl-3xl"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00F0FF] rounded-tr-3xl"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00F0FF] rounded-bl-3xl"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00F0FF] rounded-br-3xl"></div>
           </div>
           <p className="absolute bottom-1/4 text-[#00F0FF] font-bold uppercase tracking-widest text-sm text-center">
             Buscando entorno NFC...
           </p>
        </div>
      )}

      {/* The AR Medal */}
      {showMedal && (
        <motion.div 
          initial={{ scale: 0, rotateY: 180, y: 100 }}
          animate={{ scale: 1, rotateY: 0, y: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 1.5 }}
          className="relative z-20 flex flex-col items-center drop-shadow-[0_0_50px_rgba(204,255,0,0.4)]"
          style={{ perspective: 1000 }}
        >
          {/* Medal Ribbon */}
          <div className="w-16 h-32 bg-gradient-to-b from-[#FF007A] to-[#FF007A]/20 absolute -top-24 -z-10 rounded-t-full clip-ribbon"></div>
          
          {/* Medal Body */}
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
              rotateY: [0, 10, -10, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4,
              ease: "easeInOut"
            }}
            className="w-64 h-64 rounded-full border-[8px] border-[#CCFF00] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden shadow-[inset_0_0_40px_rgba(204,255,0,0.4),_0_0_50px_rgba(204,255,0,0.6)]"
          >
            {/* Glowing inner rings */}
            <div className="absolute inset-2 border-2 border-dashed border-[#00F0FF]/50 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute inset-6 border border-[#FF007A]/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            
            <Sparkles className="w-12 h-12 text-[#FFFF00] mb-2 absolute top-8" />
            <Logo className="w-24 h-24 z-10 drop-shadow-[0_0_15px_#CCFF00]" />
            <div className="text-white font-black uppercase text-xl mt-2 tracking-widest z-10 text-center px-4">
              Finisher<br/>
              <span className="text-sm text-[#00F0FF]">Jarabacoa 2026</span>
            </div>
            
            {/* Holographic glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 transform -translate-x-full animate-[shimmer_3s_infinite]"></div>
          </motion.div>
        </motion.div>
      )}

      {showMedal && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-12 z-20 text-center w-full px-6 flex flex-col items-center gap-4"
        >
          <div>
            <h2 className="text-3xl font-black italic uppercase text-white drop-shadow-lg mb-2">¡Medalla Desbloqueada!</h2>
            <p className="text-[#CCFF00] font-bold text-sm tracking-widest uppercase drop-shadow-md bg-black/50 py-2 px-6 inline-block rounded-full backdrop-blur-md">
              Realidad Aumentada - Estación 11
            </p>
          </div>
          <Link 
            to="/certificate" 
            className="px-8 py-4 bg-[#CCFF00] text-black font-black italic uppercase text-sm rounded-full shadow-[0_10px_30px_rgba(204,255,0,0.3)] hover:scale-105 active:scale-95 transition-transform"
          >
            Obtener Certificado Oficial
          </Link>
        </motion.div>
      )}

      <style>{`
        .clip-ribbon {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
