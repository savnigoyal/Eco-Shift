import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { CarbonInputData } from './types';

// Importing Views
import ParticlesBg from './components/ParticlesBg';
import Header from './components/Header';
import LandingView from './components/LandingView';
import LoginView from './components/LoginView';
import SignUpView from './components/SignUpView';
import DashboardView from './components/DashboardView';
import CarbonInputView from './components/CarbonInputView';
import TimeMachineView from './components/TimeMachineView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>('landing');
  const [userCarbonData, setUserCarbonData] = useState<CarbonInputData | null>(null);

  // Monitor Firebase Auth changes across screens
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Authenticated! Fetch user's logged habits from Firestore securely
        try {
          const docRef = doc(db, 'carbon_inputs', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserCarbonData(docSnap.data() as CarbonInputData);
          } else {
            // Backup fallback to localStorage if no cloud record yet
            const savedLocalData = localStorage.getItem('local_carbon_input');
            if (savedLocalData) {
              try {
                setUserCarbonData(JSON.parse(savedLocalData));
              } catch (e) {
                console.error(e);
              }
            } else {
              setUserCarbonData(null);
            }
          }
        } catch (error) {
          console.warn('Could not read user habits from Cloud Firestore database:', error);
          // Standard offline fallback
          const savedLocalData = localStorage.getItem('local_carbon_input');
          if (savedLocalData) {
            try {
              setUserCarbonData(JSON.parse(savedLocalData));
            } catch (e) {
              console.error(e);
            }
          }
        }
      } else {
        setUserCarbonData(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentView('landing');
    } catch (err) {
      console.error('Logout operation issue:', err);
    }
  };

  const handleSaveCarbonData = (data: CarbonInputData) => {
    setUserCarbonData(data);
    // Explicitly update offline cache as backup
    localStorage.setItem('local_carbon_input', JSON.stringify(data));
  };

  const handleNavigate = (view: string) => {
    // If user is trying to access protected views without being logged in, redirect them to login
    const protectedViews = ['dashboard', 'carbon_input', 'time_machine'];
    if (protectedViews.includes(view) && !currentUser) {
      setCurrentView('login');
    } else {
      setCurrentView(view);
    }
  };

  // Safe navigation view resolver
  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingView 
            isLoggedIn={!!currentUser} 
            onNavigate={handleNavigate} 
          />
        );
      case 'login':
        return (
          <LoginView 
            onNavigate={handleNavigate} 
            onSuccess={() => handleNavigate('dashboard')} 
          />
        );
      case 'signup':
        return (
          <SignUpView 
            onNavigate={handleNavigate} 
            onSuccess={() => handleNavigate('dashboard')} 
          />
        );
      case 'dashboard':
        return currentUser ? (
          <DashboardView 
            user={currentUser} 
            carbonData={userCarbonData} 
            onNavigate={handleNavigate} 
          />
        ) : (
          <LandingView isLoggedIn={false} onNavigate={handleNavigate} />
        );
      case 'carbon_input':
        return currentUser ? (
          <CarbonInputView 
            user={currentUser} 
            existingData={userCarbonData} 
            onSaveSuccess={handleSaveCarbonData} 
            onNavigate={handleNavigate} 
          />
        ) : (
          <LandingView isLoggedIn={false} onNavigate={handleNavigate} />
        );
      case 'time_machine':
        return (
          <TimeMachineView 
            carbonData={userCarbonData} 
            onNavigate={handleNavigate} 
          />
        );
      default:
        return (
          <LandingView 
            isLoggedIn={!!currentUser} 
            onNavigate={handleNavigate} 
          />
        );
    }
  };

  if (authLoading) {
    return (
      <div className="relative min-h-screen bg-[#030705] flex flex-col items-center justify-center text-white z-50">
        <ParticlesBg />
        <div className="relative z-10 flex flex-col items-center">
          {/* Custom logo shape spinning */}
          <div className="w-12 h-12 rounded-full border-t-2 border-emerald-400 border-r-2 border-r-transparent animate-spin mb-4" />
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#73ff59] animate-pulse">Initializing Ecosystem...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030705] text-white overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-100">
      {/* Immersive background particles canvas (fixed positioning behind content) */}
      <ParticlesBg />

      {/* Persistent global brand Header */}
      <Header 
        user={currentUser} 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout} 
      />

      {/* Mount current state view */}
      {renderCurrentView()}
    </div>
  );
}
