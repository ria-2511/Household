import { useState, useEffect } from 'react';
import ModalWrapper from '../../components/ModalWrapper';
import './ExpenseModal.scss';
const ExpenseModal = ({ isOpen, onClose, onSave, onDelete, categories, accounts, initialData, currentUser }) => {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount(initialData?.amount || '');
      setCategoryId(initialData?.categoryId || categories[0]?.id || '');
      setAccountId(initialData?.accountId || accounts[0]?.id || '');
      setDate(initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
      setNote(initialData?.note || '');
    }
  }, [isOpen, initialData, categories, accounts]);

  const handleSave = () => {
    if (!amount || Number.isNaN(Number(amount))) return;
    onSave({ 
      id: initialData?.id || Date.now(), 
      amount: Number(amount), 
      categoryId, 
      accountId, 
      date: new Date(date).toISOString(), 
      note, 
      owner: initialData?.owner || currentUser.name.split(' ')[0] 
    });
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Expense" : "Log Expense"}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center items-center gap-2 border-b-2 border-gray-100 pb-4">
          <span className="text-gray-400 text-3xl font-bold">₹</span>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full max-w-[240px] text-4xl font-bold text-[var(--color-text)] text-center focus:outline-none placeholder-gray-200" placeholder="0.00" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none min-w-0">
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Account</label>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none min-w-0">
              {accounts.filter(a => a.active).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Note</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none min-h-[60px] break-words whitespace-pre-wrap min-w-0" placeholder="What was this for?" />
        </div>

        <div className="flex gap-3 mt-2">
          {onDelete && (
            <button onClick={onDelete} className="px-5 py-4 rounded-xl font-bold bg-[color-mix(in_srgb,var(--color-danger)_12%,white)] text-red-600 hover:bg-red-100 transition-colors shrink-0">
              Delete
            </button>
          )}
          <button onClick={handleSave} className="flex-1 bg-[var(--color-danger)] text-white py-4 rounded-xl font-bold text-sm shadow-sm hover:bg-[var(--color-danger-hover)] transition-colors">
            Save Expense
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ExpenseModal;
