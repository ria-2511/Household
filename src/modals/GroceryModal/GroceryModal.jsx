import { useState, useEffect } from 'react';
import ModalWrapper from '../../components/ModalWrapper';
import './GroceryModal.scss';

const GroceryModal = ({ isOpen, onClose, onSave, onDelete, initialData, currentUser, isSaving }) => {
  const [name, setName] = useState('');
  const [qtyStr, setQtyStr] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setQtyStr(initialData?.qtyStr || '');
      setNote(initialData?.note || '');
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: initialData?.id || Date.now(),
      name,
      qtyStr: qtyStr || '1',
      note,
      owner: initialData?.owner || currentUser.name.split(' ')[0],
      done: initialData?.done || false,
      completedBy: initialData?.completedBy || null
    });
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Item" : "Add Grocery Item"}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Item Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-secondary)] text-[var(--color-text)] font-medium min-w-0" placeholder="E.g., Almond Milk" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Quantity (Optional)</label>
          <input type="text" value={qtyStr} onChange={(e) => setQtyStr(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-secondary)] text-[var(--color-text)] min-w-0" placeholder="E.g., 2 Litres, 1 Dozen, 500g" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Notes</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-secondary)] min-h-[80px] text-[var(--color-text)] break-words whitespace-pre-wrap min-w-0" placeholder="Brand preferences, aisle number..." />
        </div>
        <div className="flex gap-3 mt-4">
          {onDelete && <button onClick={onDelete} disabled={isSaving} className="px-5 py-4 rounded-xl font-bold bg-[color-mix(in_srgb,var(--color-danger)_12%,white)] text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50">Delete</button>}
          <button onClick={handleSave} disabled={isSaving} className="flex-1 bg-[var(--color-secondary)] text-white py-4 rounded-xl font-bold text-sm shadow-sm hover:bg-[var(--color-secondary-hover)] transition-colors flex justify-center items-center disabled:opacity-50">
             {isSaving ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Save Item'}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default GroceryModal;