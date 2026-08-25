import { useAppContext } from '../AppContext';
import { Copy, MapPin, CheckCircle2, Lock, Edit2, Save, X, QrCode, Users, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { db } from '../lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function Admin() {
  const { stationsData, updateStationQuiz } = useAppContext();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Edit State Form
  const [editQuestion, setEditQuestion] = useState('');
  const [editOptions, setEditOptions] = useState<string[]>(['', '', '']);
  const [editCorrectIndex, setEditCorrectIndex] = useState(0);

  const [activeTab, setActiveTab] = useState<'stations' | 'qrcodes' | 'runners'>('stations');
  const [runners, setRunners] = useState<any[]>([]);
  const [loadingRunners, setLoadingRunners] = useState(false);

  const fetchRunners = async () => {
    setLoadingRunners(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'runners'));
      const fetchedRunners = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setRunners(fetchedRunners);
    } catch (err) {
      console.error("Error fetching runners", err);
    } finally {
      setLoadingRunners(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'runners') {
      fetchRunners();
    }
  }, [activeTab, isAuthenticated]);

  const handleDeleteRunner = async (id: string) => {
    if (window.confirm("¿Seguro que deseas eliminar a este participante de la pizarra?")) {
      try {
        await deleteDoc(doc(db, 'runners', id));
        setRunners(runners.filter(r => r.id !== id));
      } catch (err) {
        console.error("Error deleting runner", err);
        alert("Error al eliminar corredor.");
      }
    }
  };

  const ADMIN_PASSWORD = 'runnerjarabacoa';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const startEditing = (station: any) => {
    setEditingId(station.id);
    setEditQuestion(station.quiz.question);
    setEditOptions([...station.quiz.options]);
    setEditCorrectIndex(station.quiz.correctIndex);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = (id: number) => {
    updateStationQuiz(id, {
      question: editQuestion,
      options: editOptions,
      correctIndex: editCorrectIndex
    });
    setEditingId(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 overflow-hidden">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[40px] shadow-2xl relative text-center">
          <div className="w-16 h-16 mx-auto bg-[#00F0FF]/20 border-2 border-[#00F0FF] text-[#00F0FF] flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(0,240,255,0.4)] mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black italic uppercase text-white mb-2">
            NFC <span className="text-[#00F0FF]">Admin</span>
          </h1>
          <p className="text-gray-400 text-xs uppercase font-bold tracking-widest mb-8">
            Acceso Restringido
          </p>
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className={`w-full px-4 py-4 bg-black/50 border ${error ? 'border-[#FF007A]' : 'border-white/20'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#CCFF00] transition-all font-medium mb-4 text-center tracking-widest`}
          />
          {error && <p className="text-[#FF007A] text-xs font-bold uppercase mb-4 animate-[shake_0.5s_ease-in-out]">Contraseña incorrecta</p>}
          
          <button type="submit" className="w-full font-black uppercase text-sm italic text-black py-4 bg-[#CCFF00] rounded-full shadow-[0_10px_30px_rgba(204,255,0,0.3)] transition-all hover:scale-105 active:scale-95">
            Desbloquear Panel
          </button>
          
          <Link to="/" className="block mt-6 text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-[#00F0FF] transition-colors">
            Volver al inicio
          </Link>
        </form>
      </div>
    );
  }

  const copyToClipboard = (id: number) => {
    const url = `${window.location.origin}/station/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10 text-white p-6 md:p-12 overflow-hidden">
      {/* Header */}
      <header className='relative z-10 flex flex-col sm:flex-row justify-between items-center mb-12 gap-4'>
        <div>
          <h1 className='text-4xl md:text-6xl font-black tracking-tighter uppercase italic'>
            NFC <span className='text-[#00F0FF]'>Admin</span>
          </h1>
          <p className="text-[#CCFF00] font-bold uppercase tracking-widest mt-2 text-sm">
            Gestión de Enlaces y Acertijos
          </p>
        </div>
        <div className="flex gap-4 flex-col sm:flex-row flex-wrap print:hidden">
          <button onClick={() => setActiveTab('stations')} className={`px-8 py-3 rounded-full font-black italic uppercase text-sm transition-all text-center border border-white/20 ${activeTab === 'stations' ? 'bg-[#CCFF00] text-black shadow-[0_5px_20px_rgba(204,255,0,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            Estaciones
          </button>
          <button onClick={() => setActiveTab('qrcodes')} className={`px-8 py-3 rounded-full font-black italic uppercase text-sm transition-all text-center border border-white/20 flex items-center justify-center gap-2 ${activeTab === 'qrcodes' ? 'bg-[#00F0FF] text-black shadow-[0_5px_20px_rgba(0,240,255,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            <QrCode className="w-4 h-4" /> Códigos QR
          </button>
          <button onClick={() => setActiveTab('runners')} className={`px-8 py-3 rounded-full font-black italic uppercase text-sm transition-all text-center border border-white/20 flex items-center justify-center gap-2 ${activeTab === 'runners' ? 'bg-[#FF007A] text-white shadow-[0_5px_20px_rgba(255,0,122,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            <Users className="w-4 h-4" /> Runners
          </button>
          <Link to="/leaderboard" className="px-8 py-3 bg-[#00F0FF] text-black hover:bg-[#00F0FF]/80 rounded-full font-black italic uppercase text-sm shadow-[0_5px_20px_rgba(0,240,255,0.4)] transition-all hover:scale-105 active:scale-95 text-center">
            Ver Pizarra
          </Link>
          <Link to="/station/11" className="px-8 py-3 bg-[#CCFF00] text-black hover:bg-[#CCFF00]/80 rounded-full font-black italic uppercase text-sm shadow-[0_5px_20px_rgba(204,255,0,0.4)] transition-all hover:scale-105 active:scale-95 text-center">
            Medalla AR (NFC 11)
          </Link>
          <Link to="/certificate?preview=true" className="px-8 py-3 bg-[#FF007A] text-white hover:bg-[#FF007A]/80 rounded-full font-black italic uppercase text-sm shadow-[0_5px_20px_rgba(255,0,122,0.4)] transition-all hover:scale-105 active:scale-95 text-center">
            Ver Certificado
          </Link>
          <Link to="/" className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-black italic uppercase text-sm border border-white/20 transition-all hover:scale-105 active:scale-95 text-center">
            Volver al Inicio
          </Link>
        </div>
      </header>
      
      {/* Grid of Stations */}
      {activeTab === 'stations' ? (
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 max-w-7xl mx-auto w-full print:hidden">
        {stationsData.map(station => {
          const url = `${window.location.origin}/station/${station.id}`;
          const isEditing = editingId === station.id;

          return (
            <div key={station.id} className={`bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl hover:border-[#CCFF00]/50 transition-colors group flex flex-col ${isEditing ? 'ring-2 ring-[#CCFF00]' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-[#CCFF00] text-black font-black text-xl flex items-center justify-center rounded-xl shadow-[0_0_15px_rgba(204,255,0,0.4)] transform -rotate-6 group-hover:rotate-0 transition-transform">
                  {station.id.toString().padStart(2, '0')}
                </div>
                <div className="flex gap-2">
                  {!isEditing && (
                    <button onClick={() => startEditing(station)} className="p-2 rounded-xl bg-white/5 hover:bg-[#00F0FF] hover:text-black transition-colors" title="Editar Acertijo">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-black uppercase italic mb-4">{station.title}</h3>
              
              {/* Quiz Info / Edit Form */}
              <div className="flex-1 bg-black/40 rounded-2xl p-4 border border-white/5 mb-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] text-[#CCFF00] uppercase font-bold tracking-widest mb-1 block">Pregunta</label>
                      <textarea 
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-2 text-sm text-white focus:border-[#CCFF00] focus:outline-none"
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#CCFF00] uppercase font-bold tracking-widest mb-1 block">Opciones</label>
                      <div className="space-y-2">
                        {editOptions.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              name={`correct_${station.id}`}
                              checked={editCorrectIndex === idx}
                              onChange={() => setEditCorrectIndex(idx)}
                              className="accent-[#CCFF00] w-4 h-4 cursor-pointer"
                            />
                            <input 
                              type="text" 
                              className="flex-1 bg-white/5 border border-white/20 rounded-lg p-2 text-sm text-white focus:border-[#CCFF00] focus:outline-none"
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...editOptions];
                                newOpts[idx] = e.target.value;
                                setEditOptions(newOpts);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => saveEditing(station.id)} className="flex-1 bg-[#CCFF00] text-black py-2 rounded-lg font-bold text-xs uppercase flex justify-center items-center gap-1">
                        <Save className="w-4 h-4" /> Guardar
                      </button>
                      <button onClick={cancelEditing} className="px-3 bg-white/10 text-white py-2 rounded-lg font-bold text-xs uppercase hover:bg-white/20">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-[10px] text-[#CCFF00] uppercase font-bold tracking-widest mb-1">Acertijo Actual</div>
                    <p className="text-sm italic font-medium mb-3 text-gray-300">{station.quiz.question}</p>
                    <ul className="space-y-2">
                      {station.quiz.options.map((opt, idx) => (
                        <li key={idx} className={`text-xs p-2 rounded-md border ${idx === station.quiz.correctIndex ? 'bg-[#CCFF00]/10 border-[#CCFF00]/50 text-[#CCFF00]' : 'border-white/10 text-gray-400'}`}>
                          {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-auto p-3 bg-black/60 rounded-2xl border border-white/10 flex items-center justify-between gap-3 group-hover:border-white/20 transition-colors">
                <div className="truncate text-[11px] text-gray-400 font-mono flex-1">{url}</div>
                <button 
                  onClick={() => copyToClipboard(station.id)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-[#CCFF00] hover:text-black text-white transition-all focus:outline-none"
                  title="Copiar enlace"
                >
                  {copiedId === station.id ? <CheckCircle2 className="w-4 h-4 text-[#CCFF00] bg-transparent" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )
        })}
      </main>
      ) : activeTab === 'qrcodes' ? (
        <main className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10 max-w-7xl mx-auto w-full bg-white text-black p-8 rounded-3xl print:p-0 print:bg-transparent">
          <div className="col-span-full flex justify-between items-center mb-4 print:hidden">
            <h2 className="text-2xl font-black italic uppercase text-[#FF007A]">Imprimir Códigos QR</h2>
            <button onClick={() => window.print()} className="px-6 py-2 bg-black text-white rounded-full font-bold uppercase text-sm">
              Imprimir
            </button>
          </div>
          {stationsData.map(station => (
            <div key={station.id} className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl">
              <h3 className="font-black text-lg mb-2">ESTACIÓN {station.id}</h3>
              <QRCodeSVG value={`${window.location.origin}/station/${station.id}`} size={150} />
              <p className="text-[10px] mt-2 font-mono text-center break-all">{`${window.location.origin}/station/${station.id}`}</p>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#FF007A] rounded-xl">
            <h3 className="font-black text-lg mb-2 text-[#FF007A]">META / AR</h3>
            <QRCodeSVG value={`${window.location.origin}/station/11`} size={150} fgColor="#FF007A" />
            <p className="text-[10px] mt-2 font-mono text-center break-all text-[#FF007A]">{`${window.location.origin}/station/11`}</p>
          </div>
        </main>
      ) : (
        <main className="relative z-10 max-w-4xl mx-auto w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px]">
          <h2 className="text-2xl font-black italic uppercase text-white mb-6">Corredores Registrados</h2>
          {loadingRunners ? (
            <div className="text-[#CCFF00] font-black italic text-center py-10 animate-pulse">Cargando corredores...</div>
          ) : runners.length === 0 ? (
            <div className="text-gray-400 font-bold uppercase tracking-widest text-center py-10">No hay corredores registrados.</div>
          ) : (
            <div className="space-y-4">
              {runners.map(runner => (
                <div key={runner.id} className="bg-black/50 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xl font-black italic uppercase text-white">{runner.userName}</div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                      Completadas: <span className="text-[#CCFF00]">{runner.completedStations?.length || 0}/10</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteRunner(runner.id)}
                    className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors"
                    title="Eliminar Corredor"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Instrucciones */}
      <div className="relative z-10 max-w-7xl mx-auto w-full mt-12 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] print:hidden">
         <h2 className="text-xl font-black uppercase italic text-[#FF007A] mb-4">¿Cómo usar estos enlaces?</h2>
         <p className="text-gray-300 font-medium">
           Para programar las estaciones físicas, necesitas etiquetas (Tags) NFC y una aplicación como <strong className="text-white">NFC Tools</strong> (disponible en iOS/Android). Escribe un registro tipo "URL / URI" en el Tag NFC y pega el enlace correspondiente a cada estación. Cuando un corredor acerque su celular, se abrirá directamente esa estación en su navegador.
         </p>
      </div>

    </div>
  )
}
