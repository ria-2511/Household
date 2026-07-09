import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { signUpWithEmail, signInWithGoogle, clearAuthError } from '../store/slices/authSlice';
import AuthShell from './AuthShell';
import './AuthShell.scss';

const SignUpView = ({ onGoLogin }) => {
  const dispatch = useAppDispatch();
  const { error, status } = useAppSelector((state) => state.auth);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    dispatch(signUpWithEmail({ email, password, displayName }));
  };

  const handleGoogle = () => {
    dispatch(clearAuthError());
    dispatch(signInWithGoogle());
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Get your own household instantly"
      footer={
        <button type="button" className="auth-link" onClick={onGoLogin}>Already have an account? Sign in</button>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-field">
          <label htmlFor="name">Your name</label>
          <input id="name" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        </div>
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
        </div>
        <button type="submit" className="auth-btn auth-btn--primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Creating account...' : 'Sign up'}
        </button>
        <div className="auth-divider">or</div>
        <button type="button" className="auth-btn auth-btn--google" onClick={handleGoogle}>
          Continue with Google
        </button>
      </form>
    </AuthShell>
  );
};

export default SignUpView;
