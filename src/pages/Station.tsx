import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { Square, ArrowRight, Trophy, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

const MOTIVATIONAL_MESSAGES = [
  "¡Excelente! Sigue corriendo hacia la próxima aventura.",
  "¡Acertijo superado! Tu identidad runner se fortalece.",
  "¡Respuesta correcta! Que no pare el ritmo, avanza.",
  "¡Mente rápida, piernas ágiles! Marca tu estación y sigue.",
  "¡Perfecto! Un paso más cerca de tu certificado final."
];

import { Logo } from '../Logo';

export default function Station() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { markCompleted, completedStations, stationsData, userName, getDuration, addPenalty } = useAppContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [motivationMsg, setMotivationMsg] = useState("");
  
  const stationId = parseInt(id || '1', 10);
  const station = stationsData.find((s) => s.id === stationId);
  const isPreviouslyCompleted = station ? completedStations.includes(station.id) : false;
  const [unlocked, setUnlocked] = useState(isPreviouslyCompleted);

  useEffect(() => {
    // Reset state on station change
    setSelectedAnswer(null);
    setMotivationMsg("");
    if (station) {
      setUnlocked(completedStations.includes(station.id));
    }
    // Stop speaking if component unmounts or changes station
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stationId, completedStations, station]);

  if (!station) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Estación no encontrada</h2>
        <Link to="/" className="text-[#CCFF00] underline">Volver al inicio</Link>
      </div>
    );
  }

  const isRouteLocked = station.id > 1 && !completedStations.includes(station.id - 1);

  if (isRouteLocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 text-white overflow-hidden text-center">
         <div className="w-24 h-24 mx-auto bg-[#FF007A]/20 border-2 border-[#FF007A] text-[#FF007A] flex items-center justify-center rounded-full shadow-[0_0_30px_rgba(255,0,122,0.4)] mb-8">
           <Lock className="w-10 h-10" />
         </div>
         <h2 className="text-4xl md:text-5xl font-black italic uppercase mb-4 text-white">
           Estación <span className="text-[#FF007A]">Bloqueada</span>
         </h2>
         <p className="text-gray-300 font-medium max-w-md mx-auto mb-8 text-lg">
           Para mantener el orden de la ruta, debes completar primero la <strong className="text-[#CCFF00]">Estación {(station.id - 1).toString().padStart(2, '0')}</strong> antes de descubrir esta.
         </p>
         <Link to="/" className="px-8 py-4 inline-flex bg-[#CCFF00] text-black font-black uppercase italic text-sm rounded-full shadow-[0_10px_30px_rgba(204,255,0,0.3)] hover:scale-105 transition-transform items-center justify-center gap-2">
           Continuar mi ruta actual
         </Link>
      </div>
    );
  }

  const isCompleted = completedStations.includes(station.id);
  const totalCompleted = new Set([...completedStations, isCompleted ? station.id : null].filter(Boolean)).size;
  const progressPercent = Math.round((totalCompleted / 10) * 100);

  const toggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta lectura de texto.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = `${station.title}. ${station.description} Dato para recordar: ${station.fact}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'es-DO';
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleOptionClick = (index: number) => {
    if (unlocked) return;
    setSelectedAnswer(index);
    if (index === station.quiz.correctIndex) {
      setUnlocked(true);
      const randomMsg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
      setMotivationMsg(randomMsg);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#CCFF00', '#FF007A', '#00F0FF', '#FFFF00']
      });
    } else {
      addPenalty(10000); // 10 seconds penalty
      setMotivationMsg("¡Incorrecto! +10 segundos de penalización a tu tiempo.");
    }
  };

  const handleComplete = async () => {
    if (!unlocked && !isCompleted) return;

    if (!isCompleted) {
      markCompleted(station.id);
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#CCFF00', '#FF007A', '#00F0FF', '#FFFF00']
      });
      return;
    }

    if (completedStations.length === 10) {
      navigate('/station/11');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10 text-white p-6 md:p-12 overflow-hidden">
      <header className='relative z-10 flex flex-col sm:flex-row justify-between items-center mb-8 gap-4'>
        <div className='flex items-center gap-4'>
          <Link to="/" className='hover:scale-105 transition-transform'>
            <Logo className="w-12 h-12 drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]" />
          </Link>
          <h1 className='text-3xl md:text-4xl font-black tracking-tighter uppercase italic'>
            Jarabacoa <span className='text-[#FF007A]'>X-Trail</span>
          </h1>
        </div>
        <div className='bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full flex items-center gap-4'>
          <div className='w-3 h-3 bg-[#CCFF00] rounded-full animate-pulse'></div>
          <span className='text-sm font-bold uppercase tracking-widest'>NFC Estación {station.id}</span>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
        <div className="lg:col-span-7 space-y-6 relative z-10">
          <div className='inline-block px-4 py-1 bg-[#CCFF00] text-black font-bold text-xs uppercase tracking-tighter transform -skew-x-12'>
            Estación Actual: {station.id.toString().padStart(2, '0')} de 10
          </div>
          
          <h2 className='text-5xl md:text-7xl font-black uppercase leading-none italic'>
            {station.title.split(' ')[0]} <br/> 
            <span className='text-[#FFFF00]'>{station.title.split(' ').slice(1).join(' ')}</span>
          </h2>
          
          <p className='text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed'>
            {station.description}
          </p>

          <div className='flex flex-col sm:flex-row gap-4 pt-4'>
            <button 
              onClick={toggleAudio}
              className='group bg-white/5 backdrop-blur-xl border-2 border-white/10 p-4 rounded-3xl flex items-center gap-6 w-full sm:w-auto min-w-[300px] hover:border-[#FF007A] transition-all text-left'
            >
              <div className='w-16 h-16 bg-[#FF007A] rounded-full flex items-center justify-center shadow-[0_0_15px_#FF007A] flex-shrink-0'>
                {isPlaying ? (
                  <Square className="w-6 h-6 text-white fill-current" />
                ) : (
                  <div className='w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1'></div>
                )}
              </div>
              <div className='flex-1'>
                <div className='text-xs uppercase text-[#FF007A] font-bold tracking-widest mb-1'>Audio Guía</div>
                <div className='text-sm font-medium'>El Contexto Histórico</div>
                <div className='mt-2 h-1 w-full bg-white/20 rounded-full overflow-hidden'>
                  <div className={`h-full bg-white ${isPlaying ? 'animate-[pulse_1.5s_infinite] w-full' : 'w-0'}`}></div>
                </div>
              </div>
            </button>
          </div>

          {/* Quiz Section */}
          <div className='mt-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 md:p-8 shadow-xl'>
            <div className='flex items-center gap-3 mb-4'>
               <div className='w-3 h-3 rounded-full bg-[#CCFF00] animate-pulse'></div>
               <span className='text-xs uppercase font-bold tracking-widest text-[#CCFF00]'>Prueba Runner</span>
            </div>
            <p className='text-xl md:text-2xl font-black italic mb-6 leading-tight'>{station.quiz.question}</p>
            <div className='space-y-3'>
               {station.quiz.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isRight = isSelected && idx === station.quiz.correctIndex;
                  const isWrong = isSelected && idx !== station.quiz.correctIndex;
                  const isActuallyRight = unlocked && idx === station.quiz.correctIndex;
                  
                  let btnClass = "w-full text-left p-4 rounded-2xl border-2 transition-all font-bold text-lg ";
                  if (isActuallyRight) {
                     btnClass += "border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.2)]";
                  } else if (isWrong) {
                     btnClass += "border-[#FF007A] bg-[#FF007A]/10 text-[#FF007A] animate-[shake_0.5s_ease-in-out]";
                  } else {
                     btnClass += "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20";
                  }
                  
                  return (
                     <button key={idx} onClick={() => handleOptionClick(idx)} disabled={unlocked} className={btnClass}>
                       {opt}
                     </button>
                  )
               })}
            </div>
            {(motivationMsg) && (
               <div className={`mt-4 p-3 rounded-xl border text-sm font-bold uppercase tracking-widest text-center animate-[pulse_2s_infinite] ${
                 unlocked 
                   ? 'bg-[#CCFF00]/20 border-[#CCFF00]/30 text-[#CCFF00]' 
                   : 'bg-[#FF007A]/20 border-[#FF007A]/30 text-[#FF007A]'
               }`}>
                 {motivationMsg}
               </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className='relative z-10 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 space-y-8 transform lg:rotate-3 shadow-2xl'>
            <div className='flex justify-between items-end'>
              <div>
                <div className='text-xs uppercase text-gray-400 font-bold tracking-widest'>Progreso de Identidad</div>
                <div className='text-5xl font-black italic'>{progressPercent}%</div>
              </div>
              <div className='text-right'>
                <div className='text-xs uppercase text-gray-400 font-bold tracking-widest'>Meta</div>
                <div className='text-sm font-bold text-[#CCFF00]'>CERTIFICADO RUNNER</div>
              </div>
            </div>
            
            <div className='grid grid-cols-5 gap-3'>
              {Array.from({length: 10}, (_, i) => i + 1).map((num) => {
                const completed = completedStations.includes(num);
                const current = num === station.id;
                return (
                  <div 
                    key={num} 
                    className={`aspect-square rounded-xl flex items-center justify-center font-black transition-all ${
                      completed && !current ? 'bg-[#CCFF00] text-black' :
                      current ? 'border-2 border-[#FF007A] bg-[#FF007A]/20 text-white shadow-[0_0_15px_#FF007A]' :
                      'border-2 border-white/10 bg-white/5 text-gray-500 opacity-50'
                    }`}
                  >
                    {num.toString().padStart(2, '0')}
                  </div>
                );
              })}
            </div>

            <div className='pt-4 border-t border-white/10'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-2 h-2 rounded-full bg-[#FF007A]'></div>
                <span className='text-[10px] uppercase font-bold tracking-tighter text-gray-400'>Dato para recordar</span>
              </div>
              <div className='p-4 bg-white/10 rounded-2xl text-sm leading-snug italic font-medium'>
                "{station.fact}"
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className='absolute top-[-20px] right-[-20px] w-40 h-40 border-4 border-[#CCFF00] rounded-full opacity-20 transform -translate-x-10 translate-y-10 hidden lg:block pointer-events-none'></div>
          <div className='absolute bottom-[-40px] left-[-40px] w-64 h-64 border border-[#FF007A] rounded-full opacity-10 hidden lg:block pointer-events-none'></div>
        </div>
      </main>

      <footer className='relative z-10 mt-12 bg-gradient-to-t from-black to-transparent flex flex-col md:flex-row justify-between items-center md:items-end gap-6 pt-10'>
        <div className='space-y-1 text-center md:text-left'>
          <div className='text-[10px] uppercase text-gray-500 font-black tracking-[0.3em]'>Mi Identidad y Jarabacoa</div>
          <div className='text-2xl font-black italic text-white/40'>RUTA RUNNER 2026</div>
        </div>
        <div className='flex flex-col sm:flex-row items-center gap-8 w-full md:w-auto'>
          <button 
            onClick={handleComplete}
            disabled={!unlocked && !isCompleted}
            className={`w-full sm:w-auto px-10 py-4 rounded-full font-black uppercase text-sm italic transition-all flex items-center justify-center gap-2 ${
              isCompleted 
                ? 'bg-white text-black hover:scale-105 active:scale-95' 
                : unlocked 
                  ? 'bg-[#CCFF00] text-black shadow-[0_10px_30px_rgba(204,255,0,0.3)] hover:scale-105 active:scale-95' 
                  : 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/20'
            }`}
          >
            {totalCompleted === 9 && !isCompleted ? (
              <>COMPLETAR RUTA <Trophy className="w-5 h-5" /></>
            ) : (
              <>
                {!unlocked && !isCompleted ? 'SUPERA LA PRUEBA' : isCompleted ? (completedStations.length === 10 ? 'IR A LA META' : 'IR AL MAPA') : 'MARCAR ESTACIÓN'}
                {unlocked && <ArrowRight className="w-5 h-5" />}
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
