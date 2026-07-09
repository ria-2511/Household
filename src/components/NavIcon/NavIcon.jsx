import './NavIcon.scss';

const NavIcon = ({ icon, label, isActive, onClick }) => (
  <div className={`flex flex-col items-center gap-1 cursor-pointer transition-opacity ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`} onClick={onClick}>
    <div className={`text-[22px] transition-colors ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>{icon}</div>
    <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </div>
);

export default NavIcon;
