import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { initializeAuth, setAuthSession } from '../store/slices/authSlice';
import {
  loadHousehold,
  startRealtimeSync,
  stopRealtimeSync,
  resetHousehold,
} from '../store/slices/householdSlice';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import LoginView from './LoginView';
import SignUpView from './SignUpView';
import JoinHouseholdView from './JoinHouseholdView';
import App from '../app';
import './AuthShell.scss';

const AuthGate = ({ children }) => {
  const dispatch = useAppDispatch();
  const { status, user, configured } = useAppSelector((state) => state.auth);
  const { needsJoin, loading: householdLoading, household } = useAppSelector((state) => state.household);
  const [authScreen, setAuthScreen] = useState('login');

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!supabase) return undefined;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setAuthSession({ session, user: session?.user ?? null }));
    });
    return () => subscription.unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (status === 'authenticated' && user?.id) {
      dispatch(loadHousehold(user.id));
    } else if (status === 'unauthenticated') {
      dispatch(stopRealtimeSync());
      dispatch(resetHousehold());
    }
  }, [status, user?.id, dispatch]);

  useEffect(() => {
    if (household?.id) {
      dispatch(startRealtimeSync(household.id));
    }
    return () => {
      dispatch(stopRealtimeSync());
    };
  }, [household?.id, dispatch]);

  if (!configured) {
    return (
      <div className="auth-loading">
        <div className="auth-shell__container text-center">
          <p className="font-bold text-[var(--color-text)] mb-2">Supabase not configured</p>
          <p className="text-sm">Copy .env.local.example to .env.local and add your project keys.</p>
        </div>
      </div>
    );
  }

  if (status === 'idle' || status === 'loading' || (status === 'authenticated' && householdLoading && !needsJoin && !household)) {
    return <div className="auth-loading">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    if (authScreen === 'signup') {
      return <SignUpView onGoLogin={() => setAuthScreen('login')} />;
    }
    if (authScreen === 'join') {
      return <JoinHouseholdView onGoLogin={() => setAuthScreen('login')} />;
    }
    return (
      <LoginView
        onGoSignUp={() => setAuthScreen('signup')}
        onGoJoin={() => setAuthScreen('join')}
      />
    );
  }

  if (needsJoin) {
    return <JoinHouseholdView authenticated onGoLogin={() => {}} />;
  }

  return children;
};

const AuthGateWrapper = () => (
  <AuthGate>
    <App />
  </AuthGate>
);

export default AuthGateWrapper;
