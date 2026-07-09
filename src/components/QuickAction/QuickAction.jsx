import './QuickAction.scss';

const QuickAction = ({ label, icon, color, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 py-3 bg-[var(--color-surface)] rounded-xl shadow-sm active:bg-gray-50 border border-gray-100 h-full">
    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-[var(--color-bg)] shrink-0" style={{ color }}>{icon}</div>
    <span className="text-[10px] font-bold text-center leading-tight text-[var(--color-text)]">{label}</span>
  </button>
);

export default QuickAction;
