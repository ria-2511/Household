import './MealSlot.scss';

const MealSlot = ({ meal, icon, recipeId, recipes, onClick, onClear }) => {
  const recipe = recipes.find(r => r.id === recipeId);
  return (
    <div onClick={onClick} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100 transition-colors group relative">
      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl shrink-0">{icon}</div>
      <div className="flex-1 min-w-0 pr-8">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{meal}</p>
        <p className={`text-sm font-medium truncate break-words min-w-0 ${recipe ? 'text-[var(--color-text)]' : 'text-gray-400 italic'}`}>
          {recipe ? recipe.title : 'Tap to plan meal...'}
        </p>
      </div>
      {/* FEATURE 4: Reset cross */}
      {recipe && onClear && (
        <button 
           onClick={(e) => { e.stopPropagation(); onClear(); }} 
           className="absolute right-2 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
            ✕
        </button>
      )}
    </div>
  );
};

export default MealSlot;