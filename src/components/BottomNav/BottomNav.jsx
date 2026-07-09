import NavIcon from '../NavIcon';
import './BottomNav.scss';

const tabs = [
  { id: 'dashboard', label: 'Home', icon: '⌂' },
  { id: 'expenses', label: 'Expenses', icon: '＄' },
  { id: 'todo', label: 'To-Do', icon: '✓' },
  { id: 'groceries', label: 'Groceries', icon: '🛒' },
  { id: 'planner', label: 'Planner', icon: '📅' },
];

const BottomNav = ({ activeTab, onTabChange }) => (
  <div className="bottom-nav">
    {tabs.map((tab) => (
      <NavIcon
        key={tab.id}
        label={tab.label}
        icon={tab.icon}
        isActive={activeTab === tab.id}
        onClick={() => onTabChange(tab.id)}
      />
    ))}
  </div>
);

export default BottomNav;
