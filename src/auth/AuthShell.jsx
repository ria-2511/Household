import './AuthShell.scss';

const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="auth-shell">
    <div className="auth-shell__container">
      <div className="auth-shell__header">
        <h1 className="auth-shell__title">{title}</h1>
        {subtitle && <p className="auth-shell__subtitle">{subtitle}</p>}
      </div>
      {children}
      {footer && <div className="auth-shell__footer">{footer}</div>}
    </div>
  </div>
);

export default AuthShell;
