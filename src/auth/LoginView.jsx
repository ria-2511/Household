import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { signInWithEmail, signInWithGoogle, clearAuthError } from '../store/slices/authSlice';
import AuthShell from './AuthShell';
import './AuthShell.scss';

const LoginView = ({ onGoSignUp, onGoJoin }) => {
  const dispatch = useAppDispatch();
  const { error, status } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    dispatch(signInWithEmail({ email, password }));
  };

  const handleGoogle = () => {
    dispatch(clearAuthError());
    dispatch(signInWithGoogle());
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your household"
      footer={
        <>
          <button type="button" className="auth-link" onClick={onGoSignUp}>Create an account</button>
          {' · '}
          <button type="button" className="auth-link" onClick={onGoJoin}>Join with code</button>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="auth-btn auth-btn--primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Signing in...' : 'Sign in'}
        </button>
        <div className="auth-divider">or</div>
        <button type="button" className="auth-btn auth-btn--google" onClick={handleGoogle}>
          Continue with Google
        </button>
      </form>
    </AuthShell>
  );
};

export default LoginView;
