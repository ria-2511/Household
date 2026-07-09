import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { createHousehold } from '../../store/slices/householdSlice';

/**
 * @component HouseholdSetupView
 * @description The landing screen for new users to choose between creating or joining a household.
 */
const HouseholdSetupView = ({ onGoJoin }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { error } = useAppSelector((state) => state.household);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await dispatch(createHousehold()).unwrap();
      // On success, Redux state changes (needsJoin becomes false)
      // and AuthGate will automatically render the App dashboard.
    } catch (err) {
      console.error('Failed to create household:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[var(--color-surface)] rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">Welcome!</h1>
          <p className="text-gray-500">To get started, please create a new household or join an existing one.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl font-bold">
            {error}
          </div>
        )}
        
        <div className="grid gap-4">
          <button 
            onClick={handleCreate}
            disabled={loading}
            className="w-full p-4 bg-[var(--color-primary)] text-white rounded-xl font-bold shadow-sm hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create New Household'}
          </button>
          
          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <button 
            onClick={onGoJoin}
            className="w-full p-4 bg-[var(--color-surface)] border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            Join Existing Household
          </button>
        </div>
      </div>
    </div>
  );
};

export default HouseholdSetupView;