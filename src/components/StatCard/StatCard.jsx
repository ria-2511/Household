import './StatCard.scss';

const StatCard = ({ label, value, sub, icon, color, onClick = undefined }) => (
  <div onClick={onClick} className={`bg-[var(--color-surface)] p-4 rounded-2xl flex-1 border-b-4 shadow-sm min-w-0 ${onClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`} style={{ borderColor: color }}>
    <div className="text-xl mb-1">{icon}</div>
    <div className="text-2xl font-bold text-[var(--color-text)] truncate">{value}</div>
    <div className="text-xs text-gray-500 mt-1 truncate">{label} • {sub}</div>
  </div>
);

export default StatCard;
