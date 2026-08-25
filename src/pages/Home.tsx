import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { motion } from 'motion/react';
import { Nfc, LogOut, MapPin, Trophy } from 'lucide-react';
import { Logo } from '../Logo';

export default function Home() {
  const { userName, setUserName, completedStations, startTimer, startTime, resetProgress } = useAppContext();
  const [nameInput, setNameInput] = useState(userName);
  const navigate = useNavigate();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      
      if (!startTime) {
        startTimer();
      }
      // Do not navigate to the station automatically to prevent cheating!
      // They must scan the NFC tag to access the station.
    }
  };

  const nextStation = Array.from({length: 10}, (_, i) => i + 1).find(
    (id) => !completedStations.includes(id)
  ) || 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[40px] shadow-2xl relative"
      >
        <div className="flex justify-center mb-6">
          <Logo className="w-24 h-24" />
        </div>
        
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-center mb-2">
          Jarabacoa <span className="text-[#FF007A]">X-Trail</span>
        </h1>
        <p className="text-gray-300 text-center mb-4 font-medium">
          Ruta Runner 2026 &middot; 10 Estaciones
        </p>

        <div className="flex justify-center mb-8">
          <Link to="/guide" className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-[#00F0FF] transition-colors">
            ¿Cómo funciona el reto? (Guía)
          </Link>
        </div>

        {!userName ? (
          <form onSubmit={handleStart} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-xs uppercase font-bold tracking-widest text-gray-400 mb-2">
                Ingresa tu nombre runner
              </label>
              <input
                id="name"
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Ej. María Pérez"
                className="w-full px-4 py-4 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#CCFF00] transition-all font-medium uppercase"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full font-black uppercase text-sm italic text-black py-4 bg-[#CCFF00] rounded-full shadow-[0_10px_30px_rgba(204,255,0,0.3)] transition-all flex items-center justify-center gap-2"
            >
              Comenzar Ruta
              <Nfc className="w-5 h-5" />
            </motion.button>
          </form>
        ) : (
          <div className="space-y-6 text-center">
            <div className="p-6 bg-white/10 border border-white/20 rounded-3xl">
              <div className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-1">Corredor Activo</div>
              <div className="text-2xl font-black italic text-white uppercase">{userName}</div>
              
              <div className="mt-6 flex justify-between items-center border-t border-white/10 pt-6">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Progreso</div>
                  <div className="text-3xl font-black italic text-[#CCFF00]">{completedStations.length}/10</div>
                </div>
                {completedStations.length < 10 ? (
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Próximo Destino</div>
                    <div className="text-lg font-black italic text-white flex items-center justify-end gap-1">
                      <MapPin className="w-4 h-4 text-[#FF007A]" /> Estación {nextStation}
                    </div>
                  </div>
                ) : (
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Próximo Destino</div>
                    <div className="text-lg font-black italic text-[#CCFF00] flex items-center justify-end gap-1">
                      <Trophy className="w-4 h-4" /> LA META
                    </div>
                  </div>
                )}
              </div>
            </div>

            {completedStations.length === 10 ? (
              <div className="p-6 bg-gradient-to-r from-[#FF007A]/20 to-[#CCFF00]/20 border border-[#CCFF00]/50 rounded-3xl text-center relative overflow-hidden">
                <Trophy className="w-12 h-12 text-[#CCFF00] mx-auto mb-3 drop-shadow-[0_0_15px_rgba(204,255,0,0.8)] relative z-10" />
                <h3 className="text-2xl font-black italic text-white uppercase mb-2 relative z-10">¡Ruta Superada!</h3>
                <p className="text-sm font-medium text-gray-200 mb-6 relative z-10">
                  Has completado las 10 estaciones de la montaña. Tu último desafío es dirigirte físicamente a la <strong className="text-[#CCFF00]">META (Estación 11)</strong>.
                </p>
                <div className="inline-block px-5 py-3 bg-black/60 rounded-xl border border-[#00F0FF]/50 text-xs font-bold text-[#00F0FF] uppercase tracking-widest animate-pulse relative z-10 mb-4">
                  Escanea el NFC de la Meta para ver tu Medalla 3D
                </div>
                <Link to="/station/11" className="block w-full max-w-xs mx-auto py-3 bg-[#CCFF00] text-black font-black uppercase italic rounded-full text-center hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(204,255,0,0.3)]">
                  SIMULAR NFC DE META
                </Link>
              </div>
            ) : (
              <div className="p-4 bg-[#FF007A]/10 border border-[#FF007A]/30 rounded-2xl">
                <p className="text-sm font-bold text-white mb-2">¡Busca la siguiente estación!</p>
                <p className="text-xs text-gray-300">
                  Debes caminar hacia la Estación {nextStation} y escanear su código NFC (o acceder a su enlace) físicamente para poder avanzar.
                </p>
              </div>
            )}

            <button
              onClick={() => {
                resetProgress();
                setNameInput('');
              }}
              className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#FF007A] transition-colors flex items-center justify-center gap-2 mx-auto mt-4"
            >
              <LogOut className="w-4 h-4" />
              Salir del Reto (Borrar Progreso)
            </button>
          </div>
        )}
      </motion.div>

      <div className="mt-8 relative z-10 text-center space-y-4 flex flex-col">
        <Link to="/leaderboard" className="text-[#00F0FF] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
          Ver Pizarra de Tiempos
        </Link>
        <Link to="/admin" className="text-gray-600 text-xs font-bold uppercase tracking-widest hover:text-[#00F0FF] transition-colors">
          Vista Administrador NFC
        </Link>
      </div>
    </div>
  );
}
