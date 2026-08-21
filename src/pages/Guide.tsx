import { Link } from 'react-router-dom';
import { Map, Zap, ShieldAlert, Brain, Sparkles, Trophy, ArrowLeft, Printer } from 'lucide-react';
import { motion } from 'motion/react';

const GUIDE_STEPS = [
  {
    icon: <Zap className="w-8 h-8 text-[#00F0FF] print:text-black" />,
    title: "1. El Arranque",
    desc: "Ingresa tu nombre en la pantalla principal de la aplicación. ¡Al hacerlo, tu cronómetro oficial comienza a correr!",
    color: "border-[#00F0FF]"
  },
  {
    icon: <Map className="w-8 h-8 text-[#FF007A] print:text-black" />,
    title: "2. Cacería en la Ruta",
    desc: "Adéntrate en la Jarabacoa X-Trail. Deberás encontrar 10 puntos de control físicos (Estaciones) equipados con etiquetas NFC.",
    color: "border-[#FF007A]"
  },
  {
    icon: <ShieldAlert className="w-8 h-8 text-[#CCFF00] print:text-black" />,
    title: "3. Orden Estricto",
    desc: "El reto es lineal. DEBES escanear las estaciones en orden (del 1 al 10). Si intentas saltarte una, encontrarás un Candado de Seguridad y no podrás avanzar.",
    color: "border-[#CCFF00]"
  },
  {
    icon: <Brain className="w-8 h-8 text-[#00F0FF] print:text-black" />,
    title: "4. Desafío Mental",
    desc: "Acerca tu móvil al NFC de cada estación. Para desbloquearla y registrar tu paso, deberás responder correctamente una trivia o acertijo sobre Jarabacoa.",
    color: "border-[#00F0FF]"
  },
  {
    icon: <Sparkles className="w-8 h-8 text-[#FF007A] print:text-black" />,
    title: "5. Experiencia AR (NFC 11)",
    desc: "Al superar la Estación 10, dirígete a la Meta (NFC 11). Escanéalo y tu cámara se activará para mostrarte una Medalla Holográfica 3D flotando en el mundo real.",
    color: "border-[#FF007A]"
  },
  {
    icon: <Trophy className="w-8 h-8 text-[#CCFF00] print:text-black" />,
    title: "6. Gloria Eterna",
    desc: "Al terminar, tu tiempo se detiene y se sube automáticamente a la Pizarra de Tiempos global en vivo. ¡Genera tu Certificado Oficial en alta calidad y compártelo!",
    color: "border-[#CCFF00]"
  }
];

export default function Guide() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 relative z-10 text-white print:text-black print:bg-white overflow-y-auto">
      <header className="w-full max-w-2xl flex justify-between items-center mb-8 print:hidden">
        <Link to="/" className="flex items-center gap-2 text-[#00F0FF] font-bold text-sm uppercase tracking-widest hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Volver
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full font-bold text-sm uppercase tracking-widest border border-white/20 transition-colors"
        >
          <Printer className="w-5 h-5" />
          Imprimir
        </button>
      </header>

      <div className="w-full max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase italic mb-2 text-center print:text-black">
          Manual del <span className="text-[#FF007A] print:text-black">Runner</span>
        </h1>
        <p className="text-gray-400 text-center mb-10 text-sm font-bold uppercase tracking-widest print:text-gray-600">
          ¿Cómo sobrevivir a la Jarabacoa X-Trail?
        </p>

        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#00F0FF] before:via-[#FF007A] before:to-[#CCFF00] print:before:bg-none print:before:bg-gray-300">
          {GUIDE_STEPS.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}
            >
              {/* Icon Marker */}
              <div className={`flex items-center justify-center w-16 h-16 rounded-full border-4 border-black print:border-gray-300 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 bg-black/80 print:bg-white backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)] print:shadow-none z-10 ${
                idx === 0 ? 'shadow-[0_0_20px_rgba(0,240,255,0.4)]' : 
                idx === 1 ? 'shadow-[0_0_20px_rgba(255,0,122,0.4)]' : 
                idx === 2 ? 'shadow-[0_0_20px_rgba(204,255,0,0.4)]' : ''
              }`}>
                {step.icon}
              </div>

              {/* Card */}
              <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3rem)] bg-white/5 print:bg-white backdrop-blur-xl border border-white/10 print:border-gray-300 p-6 rounded-3xl shadow-xl print:shadow-none hover:bg-white/10 print:hover:bg-white transition-colors">
                <h3 className="text-xl font-black italic uppercase mb-2 text-white print:text-black">{step.title}</h3>
                <p className="text-gray-400 print:text-gray-700 text-sm leading-relaxed font-medium">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center pb-12 print:hidden">
          <Link to="/" className="inline-block px-10 py-4 bg-[#CCFF00] text-black hover:bg-white rounded-full font-black italic uppercase tracking-widest shadow-[0_0_30px_rgba(204,255,0,0.4)] transition-all hover:scale-105 active:scale-95">
            ¡Estoy Listo para el Reto!
          </Link>
        </div>
      </div>
    </div>
  );
}
