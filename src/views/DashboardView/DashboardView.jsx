import { useAppDispatch, useAppSelector } from '../../store';
import { setActiveTab, setIsCreatingRecipe } from '../../store/slices/uiSlice';
import {
  formatCurrency,
  getCurrentMonthExpenses,
  getFirstName,
  getRecipeName,
  getTodayAbbr,
} from '../../helpers';
import StatCard from '../../components/StatCard';
import QuickAction from '../../components/QuickAction';
import './DashboardView.scss';

const DashboardView = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);
  const groceries = useAppSelector((state) => state.groceries.items);
  const expenses = useAppSelector((state) => state.expenses.items);
  const budget = useAppSelector((state) => state.config.monthlyBudget);
  const recipes = useAppSelector((state) => state.recipes.items);
  const menuPlan = useAppSelector((state) => state.menuPlan.plan);
  const currentUser = useAppSelector((state) => state.config.currentUser);

  const goToTab = (tab) => dispatch(setActiveTab(tab));
  const openRecipeCreator = () => {
    dispatch(setActiveTab('planner'));
    dispatch(setIsCreatingRecipe(true));
  };

  const tasksLeft = tasks.filter((t) => !t.done).length;
  const groceriesLeft = groceries.filter((g) => !g.done).length;
  const currentMonthExpenses = getCurrentMonthExpenses(expenses);
  const totalSpend = currentMonthExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const formattedSpend = formatCurrency(totalSpend);
  const formattedBudget = formatCurrency(budget);
  const todayAbbr = getTodayAbbr();
  const todaysMenu = menuPlan[todayAbbr] || {};
  const recipeName = (id) => getRecipeName(recipes, id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Hello, {getFirstName(currentUser)}! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Everything looks good today</p>
        </div>
        <button onClick={() => goToTab('admin')} className="w-10 h-10 bg-[var(--color-surface)] rounded-full flex items-center justify-center shadow-sm text-xl text-gray-500 border border-gray-100 hover:bg-gray-50">⚙</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Tasks Left" value={tasksLeft} sub="To-Do List" icon="✓" color="var(--color-primary)" onClick={() => goToTab('todo')} />
        <StatCard label="Items Needed" value={groceriesLeft} sub="Groceries" icon="🛒" color="var(--color-secondary)" onClick={() => goToTab('groceries')} />
        <div className="col-span-2 cursor-pointer" onClick={() => goToTab('expenses')}>
          <StatCard label="Monthly Spend" value={formattedSpend} sub={`Out of ${formattedBudget} budget`} icon="💰" color="var(--color-neutral)" />
        </div>
      </div>

      <div className="bg-[var(--color-surface)] p-4 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => goToTab('planner')}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-[var(--color-text)]">Today's Menu</h2>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{todayAbbr}, {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-lg shrink-0">🍳</div><div className="min-w-0 flex-1"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Breakfast</p><p className="text-sm font-medium text-[var(--color-text)] truncate break-words">{recipeName(todaysMenu.breakfast)}</p></div></div>
          <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-lg shrink-0">🥗</div><div className="min-w-0 flex-1"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Lunch</p><p className="text-sm font-medium text-[var(--color-text)] truncate break-words">{recipeName(todaysMenu.lunch)}</p></div></div>
          <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-lg shrink-0">🍝</div><div className="min-w-0 flex-1"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Dinner</p><p className="text-sm font-medium text-[var(--color-text)] truncate break-words">{recipeName(todaysMenu.dinner)}</p></div></div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold mb-3 text-[var(--color-text)]">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          <QuickAction label="Add Expense" icon="＄" color="var(--color-danger)" onClick={() => goToTab('expenses')} />
          <QuickAction label="Update Menu" icon="📅" color="var(--color-primary)" onClick={() => goToTab('planner')} />
          <QuickAction label="Add Recipe" icon="📖" color="var(--color-accent-blue)" onClick={openRecipeCreator} />
          <QuickAction label="Groceries" icon="🛒" color="var(--color-secondary)" onClick={() => goToTab('groceries')} />
          <QuickAction label="Update To-Do" icon="✓" color="var(--color-primary)" onClick={() => goToTab('todo')} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
