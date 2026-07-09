import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  previewJoinCode,
  joinHousehold,
  clearJoinPreview,
  clearHouseholdError,
} from '../store/slices/householdSlice';
import { showToast } from '../store/slices/uiSlice';
import AuthShell from './AuthShell';
import './AuthShell.scss';

const JoinHouseholdView = ({ onGoLogin, authenticated = false, onBack }) => {
  const dispatch = useAppDispatch();
  const { joinPreview, error, loading } = useAppSelector((state) => state.household);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [code, setCode] = useState('');
  const [step, setStep] = useState('enter');

  const handlePreview = async (e) => {
    e.preventDefault();
    dispatch(clearHouseholdError());
    const result = await dispatch(previewJoinCode(code.trim()));
    if (previewJoinCode.fulfilled.match(result)) {
      setStep('confirm');
    }
  };

  const handleJoin = async () => {
    if (!userId) {
      onGoLogin();
      return;
    }
    const result = await dispatch(joinHousehold({ code: code.trim(), userId }));
    if (joinHousehold.fulfilled.match(result)) {
      dispatch(showToast('Joined household'));
    }
  };

  const handleBack = () => {
    setStep('enter');
    dispatch(clearJoinPreview());
  };

  return (
    <AuthShell
      title="Join a household"
      subtitle={authenticated ? 'Enter the code shared with you' : 'Sign in first, then enter your code'}
      footer={
        !authenticated ? (
          <button type="button" className="auth-link" onClick={onGoLogin}>Sign in to join</button>
        ) : onBack ? (
           <button type="button" className="auth-link" onClick={onBack}>Back to options</button>
        ) : null
      }
    >
      {step === 'enter' ? (
        <form className="auth-form" onSubmit={handlePreview}>
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-field">
            <label htmlFor="code">Household join code</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="AB12CD34"
              maxLength={8}
              required
            />
          </div>
          <button type="submit" className="auth-btn auth-btn--primary" disabled={loading}>
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>
      ) : (
        <div className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <div className="bg-[var(--color-surface)] p-4 rounded-2xl border border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-1">You are joining</p>
            <p className="text-lg font-bold text-[var(--color-text)]">{joinPreview?.household_name}</p>
            <p className="text-xs text-gray-400 mt-2">{joinPreview?.member_count} member(s)</p>
          </div>
          <button type="button" className="auth-btn auth-btn--primary" onClick={handleJoin} disabled={loading}>
            {loading ? 'Joining...' : 'Confirm & join'}
          </button>
          <button type="button" className="auth-btn auth-btn--google" onClick={handleBack}>
            Back
          </button>
        </div>
      )}
    </AuthShell>
  );
};

export default JoinHouseholdView;
