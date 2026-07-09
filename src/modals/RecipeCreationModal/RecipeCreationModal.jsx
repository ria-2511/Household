import { useState, useEffect } from 'react';
import ModalWrapper from '../../components/ModalWrapper';
import { MEAL_TAGS } from '../../data';
import './RecipeCreationModal.scss';

const RecipeCreationModal = ({ isOpen, onClose, onSave, initialData, currentUser }) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState([]);
  
  const allTags = MEAL_TAGS;

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setIngredients(initialData?.ingredients?.join(', ') || '');
      setSteps(initialData?.steps || '');
      setNote(initialData?.note || '');
      setTags(initialData?.tags || []);
    }
  }, [isOpen, initialData]);

  const toggleTag = (tag) => setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);

  const handleSave = () => {
    if(!title.trim()) return;
    onSave({
      id: initialData?.id || Date.now(),
      title,
      ingredients: ingredients.split(',').map(i => i.trim()).filter(i => i),
      steps,
      note,
      tags: tags.length > 0 ? tags : ['Snacks'],
      owner: initialData?.owner || currentUser.name.split(' ')[0]
    });
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Recipe" : "Create Recipe"}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Recipe Name</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)] font-medium break-all min-w-0" placeholder="E.g., Poha" />
        </div>
        
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Meal Type</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${tags.includes(tag) ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-[var(--color-surface)] text-gray-500 border-gray-200'}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Ingredients (Comma separated)</label>
          <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] min-h-[60px] text-[var(--color-text)] break-words whitespace-pre-wrap min-w-0" placeholder="Onion, Tomato, Salt..." />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Steps</label>
          <textarea value={steps} onChange={e => setSteps(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] min-h-[100px] text-[var(--color-text)] break-words whitespace-pre-wrap min-w-0" placeholder="How to make it..." />
        </div>
        
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Notes (Optional)</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] min-h-[60px] text-[var(--color-text)] break-words whitespace-pre-wrap min-w-0" placeholder="Special preferences..." />
        </div>

        <div className="flex mt-4">
          <button onClick={handleSave} className="flex-1 bg-[var(--color-primary)] text-white py-4 rounded-xl font-bold text-sm shadow-sm hover:bg-[var(--color-primary-hover)] transition-colors">Save Recipe</button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default RecipeCreationModal;
