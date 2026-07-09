import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { saveExpense, removeExpense } from '../../store/slices/expensesSlice';
import { showToast } from '../../store/slices/uiSlice';
import { CHART_COLOR_VARS, USER_CHART_COLOR_VARS } from '../../data';
import {
  formatCurrency,
  filterExpensesByMonth,
  computeCategoryTotals,
  computeUserTotals,
  formatMonthYear,
  getCategoryById,
  getAccountName,
} from '../../helpers';
import DonutChart from '../../components/DonutChart';
import EmptyChartState from '../../components/EmptyChartState';
import ExpenseModal from '../../modals/ExpenseModal';
import './ExpensesView.scss';

const ExpensesView = () => {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses.items);
  const categories = useAppSelector((state) => state.config.categories);
  const accounts = useAppSelector((state) => state.config.accounts);
  const budget = useAppSelector((state) => state.config.monthlyBudget);
  const currentUser = useAppSelector((state) => state.config.currentUser);

  const [expTab, setExpTab] = useState('logs');
  const [viewDate, setViewDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const filteredExpenses = filterExpensesByMonth(expenses, viewDate);

  const handleSave = async (expData) => {
    const result = await dispatch(saveExpense({ expense: expData, isEdit: Boolean(editingExp) }));
    if (saveExpense.fulfilled.match(result)) {
      dispatch(showToast(editingExp ? 'Expense updated' : 'Expense logged'));
      setModalOpen(false);
    } else {
      dispatch(showToast(result.payload || 'Failed to save expense'));
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(removeExpense(id));
    if (removeExpense.fulfilled.match(result)) {
      dispatch(showToast('Expense deleted'));
      setModalOpen(false);
    }
  };

  const totalSpend = filteredExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const categoryTotals = computeCategoryTotals(categories, filteredExpenses);
  const userTotals = computeUserTotals(filteredExpenses);
  const chartData = categoryTotals.map((c, i) => ({ ...c, color: CHART_COLOR_VARS[i % CHART_COLOR_VARS.length] }));
  const userChartData = userTotals.map((u, i) => ({ ...u, color: USER_CHART_COLOR_VARS[i % USER_CHART_COLOR_VARS.length] }));
  const monthStr = formatMonthYear(viewDate);
  const budgetPercentage = Math.min((totalSpend / (budget || 1)) * 100, 100);

  return (
    <div className="flex flex-col h-full relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Expenses</h1>
        <p className="text-gray-500 text-sm mt-1">Track household spending</p>
      </div>

      <div className="flex bg-[var(--color-surface)] p-1 rounded-full mb-4 shadow-sm border border-gray-100 shrink-0">
        <button onClick={() => setExpTab('logs')} className={`flex-1 text-xs py-2 rounded-full font-bold transition-colors ${expTab === 'logs' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-gray-500'}`}>Logs & Entries</button>
        <button onClick={() => setExpTab('analytics')} className={`flex-1 text-xs py-2 rounded-full font-bold transition-colors ${expTab === 'analytics' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-gray-500'}`}>Spend Analytics</button>
      </div>

      <div className="flex items-center justify-between bg-[var(--color-surface)] rounded-2xl p-3 shadow-sm border border-gray-100 mb-4 shrink-0">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center font-bold text-gray-500 hover:bg-gray-50 rounded-lg">{'<'}</button>
        <span className="font-bold text-sm text-[var(--color-text)]">{monthStr} {expTab === 'analytics' ? 'Analytics' : ''}</span>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center font-bold text-gray-500 hover:bg-gray-50 rounded-lg">{'>'}</button>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {expTab === 'logs' ? (
          <div className="flex flex-col gap-3">
            <button onClick={() => { setEditingExp(null); setModalOpen(true); }} className="w-full border-2 border-dashed border-gray-300 text-gray-500 py-4 mb-2 rounded-2xl text-sm font-bold hover:bg-[var(--color-surface)] hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
              <span className="text-xl">＋</span> Log New Expense
            </button>
            {filteredExpenses.map((exp) => (
              <div key={exp.id} onClick={() => { setEditingExp(exp); setModalOpen(true); }} className="bg-[var(--color-surface)] p-4 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-all flex justify-between items-center">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg shrink-0">{getCategoryById(categories, exp.categoryId)?.icon}</span>
                    <span className="font-bold text-sm text-[var(--color-text)] truncate">{getCategoryById(categories, exp.categoryId)?.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">{getAccountName(accounts, exp.accountId)}</div>
                  {exp.note && <p className="text-xs text-gray-400 mt-2 break-words whitespace-pre-wrap min-w-0">{exp.note}</p>}
                  <div className="mt-3 text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0"></span> Added by {exp.owner}
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="font-bold text-[var(--color-danger)] whitespace-nowrap">{formatCurrency(exp.amount)}</span>
                  <span className="text-[10px] text-gray-400 mt-1">{new Date(exp.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            ))}
            {filteredExpenses.length === 0 && <div className="text-center text-gray-400 py-8 text-sm">No expenses logged for {monthStr}.</div>}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-gray-100 relative">
              <div className="text-center mb-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Spend</p>
                <p className="text-4xl font-bold text-[var(--color-text)]">{formatCurrency(totalSpend)}</p>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-[var(--color-primary)] transition-all duration-500" style={{ width: `${budgetPercentage}%` }}></div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 font-bold">{Math.round(budgetPercentage)}% of {formatCurrency(budget)} budget</p>
              </div>
              {totalSpend > 0 ? <DonutChart data={chartData} /> : <EmptyChartState />}
            </div>

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-2 px-1">Spend by Category</h3>
            <div className="flex flex-col gap-2">
              {chartData.map((item) => (
                <div key={item.id} className="bg-[var(--color-surface)] p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-lg shrink-0">{item.icon}</span>
                    <span className="font-medium text-sm text-[var(--color-text)]">{item.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-sm text-[var(--color-text)]">{formatCurrency(item.total)}</span>
                    <span className="text-[10px] text-gray-400 font-bold">{(item.percentage || 0).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
              {chartData.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No category data</p>}
            </div>

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-4 px-1 pt-4 border-t border-gray-200">Spend by User</h3>
            <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-gray-100">
              {totalSpend > 0 ? (
                <div className="flex flex-col items-center">
                  <DonutChart data={userChartData} size={140} innerLabel="Users" />
                </div>
              ) : (
                <EmptyChartState size={140} />
              )}
              <div className="flex flex-col gap-2 mt-6">
                {userChartData.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: user.color }}></span>
                      <span className="font-medium text-sm text-[var(--color-text)]">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-[var(--color-text)]">{formatCurrency(user.total)}</span>
                      <span className="text-[10px] text-gray-400 font-bold w-8 text-right">{(user.percentage || 0).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
                {userChartData.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No user data</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={editingExp ? () => handleDelete(editingExp.id) : null}
        categories={categories}
        accounts={accounts}
        initialData={editingExp}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ExpensesView;
