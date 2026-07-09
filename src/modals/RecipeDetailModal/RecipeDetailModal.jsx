import { useState } from 'react';
import ModalWrapper from '../../components/ModalWrapper';
import './RecipeDetailModal.scss';
const RecipeDetailModal = ({ isOpen, onClose, recipe, onEdit, onDelete }) => {
    if (!recipe || !isOpen) return null;
    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Recipe Details">
            <div className="flex flex-col gap-5">
                <div>
                    <h2 className="text-xl font-bold text-[var(--color-text)] break-words min-w-0">{recipe.title}</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {recipe.tags.map(tag => <span key={tag} className="px-2 py-1 bg-[var(--color-bg)] text-[var(--color-primary)] rounded text-[10px] font-bold uppercase">{tag}</span>)}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ingredients</h3>
                    <ul className="list-disc pl-5 text-sm text-[var(--color-text)] space-y-1">
                        {recipe.ingredients.map((ing, i) => <li key={i} className="break-words min-w-0">{ing}</li>)}
                    </ul>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Steps</h3>
                    <p className="text-sm text-[var(--color-text)] break-words whitespace-pre-wrap min-w-0">{recipe.steps}</p>
                </div>
                
                {recipe.note && (
                    <div className="bg-[var(--color-bg)] p-3 rounded-xl border border-gray-200">
                        <h3 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1">Notes</h3>
                        <p className="text-xs text-[var(--color-text)] break-words whitespace-pre-wrap min-w-0">{recipe.note}</p>
                    </div>
                )}

                <div className="flex justify-between items-center mt-2 border-t pt-4">
                     <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Added by {recipe.owner}
                     </span>
                    <div className="flex gap-2">
                        <button onClick={onDelete} className="px-4 py-2 rounded-lg font-bold bg-[color-mix(in_srgb,var(--color-danger)_12%,white)] text-red-600 hover:bg-red-100 text-xs transition-colors">Delete</button>
                        <button onClick={onEdit} className="px-4 py-2 rounded-lg font-bold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] text-xs shadow-sm transition-colors">Edit</button>
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
}

export default RecipeDetailModal;
