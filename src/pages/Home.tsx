import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { motion } from 'motion/react';
import { Nfc } from 'lucide-react';

import { Logo } from '../Logo';

export default function Home() {
  const { userName, setUserName, completedStations, startTimer, startTime } = useAppContext();
  const [nameInput, setNameInput] = useState(userName);
  const navigate = useNavigate();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      
      if (!startTime) {
        startTimer();
      }

      // Find first uncompleted station or default to 1
      const nextStation = Array.from({length: 10}, (_, i) => i + 1).find(
        (id) => !completedStations.includes(id)
      ) || 1;
      
      if (completedStations.length === 10) {
        navigate('/certificate');
      } else {
        navigate(`/station/${nextStation}`);
      }
    }
  };

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

        {completedStations.length > 0 && completedStations.length < 10 && (
          <div className="mb-6 p-4 bg-white/10 border border-white/20 rounded-2xl">
            <p className="text-[#CCFF00] text-center text-sm font-bold uppercase tracking-widest">
              NFC Activado: {completedStations.length}/10 Estaciones
            </p>
          </div>
        )}

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
            {completedStations.length > 0 ? "Continuar Ruta" : "Comenzar Ruta"}
            <Nfc className="w-5 h-5" />
          </motion.button>
        </form>
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
