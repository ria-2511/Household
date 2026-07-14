import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  saveProfile,
  saveMonthlyBudget,
  setMonthlyBudget,
  addCategoryRemote,
  addAccountRemote,
  toggleAccountRemote,
} from '../../store/slices/configSlice';
import { signOut } from '../../store/slices/authSlice';
import { showToast } from '../../store/slices/uiSlice';
import ThemePicker from '../../components/ThemePicker';
import HouseholdSharing from '../../components/HouseholdSharing';
import './AdminView.scss';

const AdminView = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.config.categories);
  const accounts = useAppSelector((state) => state.config.accounts);
  const budget = useAppSelector((state) => state.config.monthlyBudget);
  const currentUser = useAppSelector((state) => state.config.currentUser);

  const [newCat, setNewCat] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🏷️'); // FEATURE 6: New state for icon
  const [newAcc, setNewAcc] = useState('');
  const [tempName, setTempName] = useState(currentUser.name);

  const handleUpdateName = async () => {
    if (!tempName.trim()) return;
    const result = await dispatch(saveProfile({ ...currentUser, name: tempName.trim() }));
    if (saveProfile.fulfilled.match(result)) {
      dispatch(showToast('Profile updated'));
    } else {
      dispatch(showToast(result.payload || 'Failed to update profile'));
    }
  };

  const handleBudgetBlur = async () => {
    const result = await dispatch(saveMonthlyBudget(budget));
    if (saveMonthlyBudget.rejected.match(result)) {
      dispatch(showToast(result.payload || 'Failed to save budget'));
    }
  };

  const handleAddCategory = async () => {
    if (!newCat.trim()) return;
    const result = await dispatch(addCategoryRemote({ name: newCat, icon: newCatIcon || '🏷️' }));
    if (addCategoryRemote.fulfilled.match(result)) {
      setNewCat('');
      setNewCatIcon('🏷️'); // Reset icon
      dispatch(showToast('Category added'));
    }
  };

  const handleAddAccount = async () => {
    if (!newAcc.trim()) return;
    const result = await dispatch(addAccountRemote({ name: newAcc, active: true }));
    if (addAccountRemote.fulfilled.match(result)) {
      setNewAcc('');
      dispatch(showToast('Account added'));
    }
  };

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-[120px] overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your household</p>
      </div>

      <div className="flex flex-col gap-5 mt-2 flex-1">
        <HouseholdSharing />
        <ThemePicker />

        <div className="bg-[var(--color-surface)] p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-3 text-sm text-[var(--color-text)] border-b pb-2">User Profile</h3>
          <div className="flex items-end gap-3">
            <div className="flex-1 min-w-0">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Your Name</label>
              <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] min-w-0" />
            </div>
            <button onClick={handleUpdateName} className="bg-[var(--color-primary)] text-white h-[46px] px-5 rounded-xl text-sm font-bold shadow-sm hover:bg-[var(--color-primary-hover)] transition-colors shrink-0">Save</button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">This name will be attached to items you create and mark as done.</p>
        </div>

        <div className="bg-[var(--color-surface)] p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-3 text-sm text-[var(--color-text)] border-b pb-2">Monthly Budget</h3>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-bold text-lg shrink-0">₹</span>
            <input
              type="number"
              value={budget}
              onChange={(e) => dispatch(setMonthlyBudget(Number(e.target.value)))}
              onBlur={handleBudgetBlur}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] font-bold min-w-0"
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Used to calculate your progress bar in Expense Analytics.</p>
        </div>

        <div className="bg-[var(--color-surface)] p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-3 text-sm text-[var(--color-text)] border-b pb-2">Expense Categories</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => <span key={cat.id} className="px-3 py-1 rounded-full bg-[var(--color-bg)] text-[var(--color-text)] text-sm flex items-center gap-1 shadow-sm shrink-0">{cat.icon} {cat.name}</span>)}
          </div>
          <div className="flex gap-2">
            {/* FEATURE 6: Icon Input */}
            <input type="text" placeholder="🍕" value={newCatIcon} onChange={(e) => setNewCatIcon(e.target.value)} className="w-12 bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-center text-sm focus:outline-none min-w-0" maxLength={2} />
            <input type="text" placeholder="New category name..." value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none min-w-0" />
            <button onClick={handleAddCategory} className="bg-[var(--color-primary)] text-white h-[38px] w-[38px] rounded-lg flex items-center justify-center hover:bg-[var(--color-primary-hover)] shrink-0"><span className="text-xl">＋</span></button>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-3 text-sm text-[var(--color-text)] border-b pb-2">Financial Accounts</h3>
          <div className="flex flex-col gap-3">
            {accounts.map((acc) => (
              <div key={acc.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="text-xl shrink-0">{acc.name.includes('Cash') ? '💵' : '💳'}</span>
                  <span className="font-medium text-sm text-[var(--color-text)] min-w-0 break-all">{acc.name}</span>
                </div>
                <button onClick={() => dispatch(toggleAccountRemote(acc.id))} className={`text-[10px] px-3 py-1.5 rounded-md font-bold border shrink-0 ${acc.active ? 'bg-green-50 text-green-700' : 'bg-[var(--color-surface)] text-gray-500'}`}>
                  {acc.active ? 'Active' : 'Disabled'}
                </button>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <input type="text" placeholder="New account name..." value={newAcc} onChange={(e) => setNewAcc(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddAccount()} className="flex-1 bg-[var(--color-surface)] shadow-sm border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none min-w-0" />
              <button onClick={handleAddAccount} className="bg-[var(--color-surface)] text-gray-500 border border-gray-200 shadow-sm h-[46px] px-4 rounded-xl font-bold hover:bg-gray-50 text-sm shrink-0">Add</button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full py-3 rounded-xl text-sm font-bold border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default AdminView;