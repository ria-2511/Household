import { useState, useEffect } from 'react';
import ModalWrapper from '../../components/ModalWrapper';
import './TaskModal.scss';
const TaskModal = ({ isOpen, onClose, onSave, onDelete, initialData, currentUser }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setDesc(initialData?.desc || '');
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: initialData?.id || Date.now(),
      title,
      desc,
      owner: initialData?.owner || currentUser.name.split(' ')[0], 
      done: initialData?.done || false,
      completedBy: initialData?.completedBy || null
    });
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Task" : "Add Task"}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Task Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)] font-medium min-w-0" placeholder="E.g., Call the plumber" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Description / Notes</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] min-h-[100px] text-[var(--color-text)] break-words whitespace-pre-wrap min-w-0" placeholder="Add any details..." />
        </div>
        <div className="flex gap-3 mt-4">
          {onDelete && <button onClick={onDelete} className="px-5 py-4 rounded-xl font-bold bg-[color-mix(in_srgb,var(--color-danger)_12%,white)] text-red-600 hover:bg-red-100 transition-colors">Delete</button>}
          <button onClick={handleSave} className="flex-1 bg-[var(--color-primary)] text-white py-4 rounded-xl font-bold text-sm shadow-sm hover:bg-[var(--color-primary-hover)] transition-colors">Save Task</button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default TaskModal;
