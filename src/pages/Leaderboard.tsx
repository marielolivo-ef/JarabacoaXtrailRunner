import { useEffect, useState } from 'react';
import { Trophy, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'runners'));
        const runners = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.userName,
            completedStations: data.completedStations || [],
            time: data.startTime ? (data.updatedAt?.toMillis ? (data.updatedAt.toMillis() - data.startTime + (data.penalties || 0)) : 0) : 0,
            startTime: data.startTime
          };
        });
        
        // Filter those who completed all 10 stations
        const completedRunners = runners.filter(r => r.completedStations.length >= 10);
        // Sort by fastest time
        completedRunners.sort((a, b) => a.time - b.time);
        
        setLeaderboard(completedRunners);
      } catch (error) {
        console.error("Error fetching leaderboard from Firebase", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 relative z-10 text-white overflow-hidden">
      <header className='w-full max-w-4xl flex justify-between items-center mb-12'>
        <Link to="/" className="text-[#00F0FF] font-bold text-sm uppercase tracking-widest hover:text-white transition-colors">
          ← Volver al inicio
        </Link>
      </header>

      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl relative">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#CCFF00] flex items-center justify-center rounded-full shadow-[0_0_30px_rgba(204,255,0,0.5)]">
             <Trophy className="w-10 h-10 text-black" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-center mb-2">
          Pizarra de <span className="text-[#CCFF00]">Tiempos</span>
        </h1>
        <p className="text-gray-400 text-center mb-10 text-sm font-bold uppercase tracking-widest">
          Los mejores runners de Jarabacoa X-Trail
        </p>

        {loading ? (
          <div className="text-center text-[#CCFF00] animate-pulse py-10 font-black italic text-xl">Cargando tiempos...</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center text-gray-500 py-10 font-bold uppercase tracking-widest">Aún no hay tiempos registrados. ¡Sé el primero!</div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((entry, idx) => (
              <div 
                key={entry.id} 
                className={`flex items-center justify-between p-4 md:p-6 rounded-2xl border ${
                  idx === 0 
                    ? 'bg-[#FF007A]/20 border-[#FF007A] shadow-[0_0_20px_rgba(255,0,122,0.3)] text-white' 
                    : idx === 1 
                      ? 'bg-white/10 border-[#00F0FF]/50 text-gray-200'
                      : idx === 2
                        ? 'bg-white/5 border-[#CCFF00]/30 text-gray-300'
                        : 'bg-black/40 border-white/5 text-gray-400'
                }`}
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className={`text-2xl md:text-3xl font-black italic w-8 text-center ${
                    idx === 0 ? 'text-[#FF007A]' : idx === 1 ? 'text-[#00F0FF]' : idx === 2 ? 'text-[#CCFF00]' : 'text-gray-600'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${idx < 3 ? 'bg-white/20' : 'bg-white/5'}`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-black text-lg md:text-xl uppercase italic">{entry.name}</div>
                      <div className="text-xs uppercase tracking-widest opacity-50">Runner Oficial</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 font-bold text-xl md:text-2xl font-mono">
                  <Clock className="w-5 h-5 opacity-50" />
                  {formatTime(entry.time)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
