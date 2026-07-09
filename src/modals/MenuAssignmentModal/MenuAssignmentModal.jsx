import { useState } from 'react';
import ModalWrapper from '../../components/ModalWrapper';
import './MenuAssignmentModal.scss';
const MenuAssignmentModal = ({ isOpen, onClose, recipes, onAssign, onCreateNew }) => {
  const [search, setSearch] = useState('');
  const filtered = recipes.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Select Recipe">
      <div className="flex flex-col gap-4 max-h-[60vh]">
        <input type="text" placeholder="Search recipes..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] min-w-0" />
        
        <div className="overflow-y-auto flex flex-col gap-2">
          {filtered.map(r => (
            <div key={r.id} onClick={() => onAssign(r.id)} className="p-3 bg-[var(--color-surface)] border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 flex justify-between items-center">
              <span className="font-medium text-sm text-[var(--color-text)] break-words flex-1 min-w-0 mr-2">{r.title}</span>
              <span className="text-[10px] px-2 py-1 bg-[var(--color-bg)] text-[var(--color-primary)] rounded-full shrink-0">{r.tags[0]}</span>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-sm text-gray-500 py-4">No recipes found.</p>}
        </div>

        <button onClick={onCreateNew} className="mt-2 text-sm font-bold text-[var(--color-primary)] py-3 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50">
          ＋ Create New Recipe
        </button>
      </div>
    </ModalWrapper>
  );
};

export default MenuAssignmentModal;
