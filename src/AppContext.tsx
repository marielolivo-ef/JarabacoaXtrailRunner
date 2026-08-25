import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { stations as defaultStations, Station } from './data';
import { db, serverTimestamp } from './lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AppContextType {
  userName: string;
  setUserName: (name: string) => void;
  completedStations: number[];
  markCompleted: (id: number) => void;
  resetProgress: () => void;
  stationsData: Station[];
  updateStationQuiz: (id: number, quiz: Station['quiz']) => void;
  startTime: number | null;
  startTimer: () => void;
  getDuration: () => number | null;
  penalties: number;
  addPenalty: (ms: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [runnerId, setRunnerId] = useState(() => {
    let id = localStorage.getItem('jarabacoa_runnerid');
    if (!id) {
      id = 'runner-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('jarabacoa_runnerid', id);
    }
    return id;
  });

  const [isInitialized, setIsInitialized] = useState(false);

  const [userName, setUserNameState] = useState(() => {
    return localStorage.getItem('jarabacoa_username') || '';
  });
  
  const [completedStations, setCompletedStations] = useState<number[]>(() => {
    const saved = localStorage.getItem('jarabacoa_completed');
    return saved ? JSON.parse(saved) : [];
  });

  const [stationsData, setStationsData] = useState<Station[]>(() => {
    const saved = localStorage.getItem('jarabacoa_stations');
    return saved ? JSON.parse(saved) : defaultStations;
  });

  const [startTime, setStartTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('jarabacoa_starttime');
    return saved ? parseInt(saved, 10) : null;
  });

  const [penalties, setPenalties] = useState<number>(() => {
    const saved = localStorage.getItem('jarabacoa_penalties');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [endTime, setEndTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('jarabacoa_endtime');
    return saved ? parseInt(saved, 10) : null;
  });

  // Pull from Firebase on mount
  useEffect(() => {
    const fetchFromFirebase = async () => {
      try {
        const docRef = doc(db, 'runners', runnerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.userName) {
            setUserNameState(data.userName);
            localStorage.setItem('jarabacoa_username', data.userName);
          }
          if (data.startTime) {
            setStartTime(data.startTime);
            localStorage.setItem('jarabacoa_starttime', data.startTime.toString());
          }
          if (data.endTime) {
            setEndTime(data.endTime);
            localStorage.setItem('jarabacoa_endtime', data.endTime.toString());
          }
          if (data.penalties !== undefined) {
            setPenalties(data.penalties);
            localStorage.setItem('jarabacoa_penalties', data.penalties.toString());
          }
          if (data.completedStations) {
            setCompletedStations(data.completedStations);
            localStorage.setItem('jarabacoa_completed', JSON.stringify(data.completedStations));
          }
        }
      } catch (e) {
        console.error("Firebase sync error:", e);
      } finally {
        setIsInitialized(true);
      }
    };
    fetchFromFirebase();
  }, [runnerId]);

  // Push to Firebase on state changes
  useEffect(() => {
    if (isInitialized && startTime && userName) {
      setDoc(doc(db, 'runners', runnerId), {
        userName,
        startTime,
        endTime,
        penalties,
        completedStations,
        updatedAt: serverTimestamp()
      }, { merge: true }).catch(err => console.error("Firebase write error:", err));
    }
  }, [isInitialized, runnerId, userName, startTime, endTime, penalties, completedStations]);

  const startTimer = () => {
    const now = Date.now();
    setStartTime(now);
    setEndTime(null);
    localStorage.setItem('jarabacoa_starttime', now.toString());
    localStorage.removeItem('jarabacoa_endtime');
  };

  const getDuration = () => {
    if (!startTime) return null;
    return ((endTime || Date.now()) - startTime) + penalties;
  };

  const addPenalty = (ms: number) => {
    setPenalties((prev) => {
      const newState = prev + ms;
      localStorage.setItem('jarabacoa_penalties', newState.toString());
      return newState;
    });
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem('jarabacoa_username', name);
  };

  const markCompleted = (id: number) => {
    setCompletedStations((prev) => {
      if (prev.includes(id)) return prev;
      const newState = [...prev, id];
      localStorage.setItem('jarabacoa_completed', JSON.stringify(newState));
      if (newState.length === 10 && !endTime) {
        const now = Date.now();
        setEndTime(now);
        localStorage.setItem('jarabacoa_endtime', now.toString());
      }
      return newState;
    });
  };

  const updateStationQuiz = (id: number, quiz: Station['quiz']) => {
    setStationsData((prev) => {
      const newState = prev.map(s => s.id === id ? { ...s, quiz } : s);
      localStorage.setItem('jarabacoa_stations', JSON.stringify(newState));
      return newState;
    });
  };

  const resetProgress = () => {
    setUserNameState('');
    setCompletedStations([]);
    setStartTime(null);
    setEndTime(null);
    setPenalties(0);
    localStorage.removeItem('jarabacoa_username');
    localStorage.removeItem('jarabacoa_completed');
    localStorage.removeItem('jarabacoa_starttime');
    localStorage.removeItem('jarabacoa_endtime');
    localStorage.removeItem('jarabacoa_penalties');
    localStorage.removeItem('jarabacoa_runnerid');
    const newId = 'runner-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    setRunnerId(newId);
    localStorage.setItem('jarabacoa_runnerid', newId);
  };

  return (
    <AppContext.Provider value={{ userName, setUserName, completedStations, markCompleted, resetProgress, stationsData, updateStationQuiz, startTime, startTimer, getDuration, penalties, addPenalty }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
