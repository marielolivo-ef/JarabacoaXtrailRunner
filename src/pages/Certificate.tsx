import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Share2, RotateCcw, Download, Camera, Instagram } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Logo } from '../Logo';

export default function Certificate() {
  const { userName, completedStations, resetProgress, markCompleted } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true';
  const hasTriggeredConfetti = useRef(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selfie, setSelfie] = useState<string | null>(null);

  useEffect(() => {
    // Only show if actually completed or in preview
    if (!isPreview && completedStations.length < 10 && process.env.NODE_ENV !== 'development') {
      navigate('/'); 
      return;
    }
    markCompleted(11);

    if (!hasTriggeredConfetti.current) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#CCFF00', '#FF007A', '#00F0FF', '#FFFF00']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#CCFF00', '#FF007A', '#00F0FF', '#FFFF00']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
      hasTriggeredConfetti.current = true;
    }
  }, [completedStations.length, navigate, isPreview]);

  const handleReset = () => {
    resetProgress();
    navigate('/');
  };

  const handleShare = async () => {
    const text = `¡Completé la Ruta Runner de Jarabacoa X-Trail! 10/10 estaciones. 🏃‍♂️💨\n\nÚnete al reto aquí: ${window.location.origin}`;
    
    if (certificateRef.current) {
      try {
        const dataUrl = await toPng(certificateRef.current, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: '#000000',
        });
        
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'certificado.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Certificado Jarabacoa X-Trail',
            text: text,
          });
          return;
        } else if (navigator.share) {
          await navigator.share({
            title: 'Certificado Jarabacoa X-Trail',
            text: text,
            url: window.location.origin,
          });
          return;
        }
      } catch (err) {
        console.error('Error sharing', err);
      }
    }

    // Fallback if Web Share API is not available (like on desktop)
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(certificateRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#000000',
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Certificado_Jarabacoa_${userName || 'Runner'}.png`;
      link.click();
    } catch (err) {
      console.error('Error downloading certificate', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const displayUser = userName || (isPreview ? 'Runner de Prueba' : 'Runner');

  const handleSelfieCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfie(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 overflow-hidden">
      
      {/* Certificate Card for Capture */}
      <motion.div 
        ref={certificateRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-full max-w-2xl bg-black border border-white/20 rounded-[40px] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
      >
        {/* Colorful background elements for the PNG export */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#FF007A] rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#00F0FF] rounded-full blur-[120px]"></div>
        </div>

        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#CCFF00] via-[#00F0FF] to-[#FF007A]" />
        
        <div className="relative z-10">
          {selfie ? (
            <div className="w-32 h-32 mx-auto rounded-full shadow-[0_0_30px_#00F0FF] mb-6 overflow-hidden border-4 border-[#00F0FF]">
              <img src={selfie} alt="Victoria Selfie" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="flex justify-center mb-8">
               <Logo className="w-24 h-24 drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]" />
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-none tracking-tighter mb-4 text-[#FFFF00] drop-shadow-lg">
            Certificado <br/> <span className="text-white">Oficial Runner</span>
          </h1>
          
          <div className='inline-block px-4 py-1 bg-[#FF007A] text-white font-bold text-xs uppercase tracking-tighter transform -skew-x-12 mb-8 shadow-lg'>
            Ruta de Identidad: Jarabacoa
          </div>

          <p className="text-gray-300 text-sm uppercase tracking-widest font-bold mb-2">Otorgado a:</p>
          <div className="mb-8 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
            <p className="text-4xl md:text-5xl font-black italic uppercase text-[#CCFF00] drop-shadow-md">{displayUser}</p>
          </div>

          <p className="text-gray-200 mb-6 leading-relaxed max-w-xl mx-auto font-medium">
            Por haber completado con éxito el recorrido exploratorio de las <strong className="text-[#00F0FF] font-black">10 estaciones</strong>, conociendo la historia, cultura, ecoturismo y deporte que forjan la identidad de Jarabacoa.
          </p>
          
          <div className="flex justify-center items-center gap-2 text-white/50 text-xs font-black uppercase tracking-[0.2em] mt-8">
             <span>Jarabacoa X-Trail</span>
             <span className="w-1 h-1 bg-[#CCFF00] rounded-full"></span>
             <span>2026</span>
          </div>


        </div>
      </motion.div>

      {/* Action Buttons (Not captured in PNG because they are outside the ref) */}
      <div className="flex flex-wrap gap-4 justify-center mt-8 relative z-10 w-full max-w-2xl">
        <a 
          href="https://www.instagram.com/marielolivoj?igsi=d2Y3c2ZnbmowdGRx" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white font-black italic uppercase text-sm rounded-full shadow-[0_10px_30px_rgba(253,29,29,0.3)] hover:scale-[1.02] transition-transform mb-2"
        >
          <Instagram className="w-5 h-5" /> Síguenos en Instagram @marielolivoj
        </a>
        <input 
          type="file" 
          accept="image/*" 
          capture="user"
          className="hidden" 
          ref={fileInputRef}
          onChange={handleSelfieCapture}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="px-8 py-4 bg-[#CCFF00] text-black font-black italic uppercase text-sm rounded-full flex justify-center items-center gap-2 hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(204,255,0,0.3)] flex-1 min-w-[200px]"
        >
          <Camera className="w-5 h-5" /> {selfie ? 'Cambiar Foto' : 'Selfie de Victoria'}
        </button>
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="px-8 py-4 bg-[#FF007A] text-white font-black italic uppercase text-sm rounded-full flex justify-center items-center gap-2 hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(255,0,122,0.3)] disabled:opacity-50 flex-1 min-w-[200px]"
        >
          <Download className="w-5 h-5" /> {isDownloading ? 'Guardando...' : 'Descargar PNG'}
        </button>
        <button 
          onClick={handleShare}
          className="px-8 py-4 bg-[#00F0FF] text-black font-black italic uppercase text-sm rounded-full flex justify-center items-center gap-2 hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(0,240,255,0.3)] flex-1 min-w-[200px]"
        >
          <Share2 className="w-5 h-5" /> Compartir en IG / WA
        </button>
        <button 
          onClick={handleReset}
          className="px-8 py-4 bg-transparent border-2 border-white/20 text-white font-black italic uppercase text-sm rounded-full flex justify-center items-center gap-2 hover:bg-white/10 transition-colors flex-1 min-w-[200px]"
        >
          <RotateCcw className="w-5 h-5" /> Nueva Ruta
        </button>
      </div>
      
    </div>
  );
}
