import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Home from './pages/Home';
import Station from './pages/Station';
import Certificate from './pages/Certificate';
import Admin from './pages/Admin';
import Leaderboard from './pages/Leaderboard';
import ARMedal from './pages/ARMedal';
import Guide from './pages/Guide';
import FloatingBackground from './components/FloatingBackground';
import MusicPlayer from './components/MusicPlayer';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-black print:bg-white text-white print:text-black font-sans selection:bg-[#FF007A]/30">
          <div className="print:hidden">
            <FloatingBackground />
            <MusicPlayer />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/station/:id" element={<Station />} />
            <Route path="/certificate" element={<Certificate />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/station/11" element={<ARMedal />} />
            <Route path="/ar-medal" element={<ARMedal />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
