import './GroceryItem.scss';

const GroceryItem = ({ item, onToggle, onEdit }) => (
  <div className={`flex items-start p-4 bg-[var(--color-surface)] rounded-2xl shadow-sm border border-gray-100 transition-all cursor-pointer hover:bg-gray-50 ${item.done ? 'opacity-70' : ''}`} onClick={onEdit}>
    <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${item.done ? 'bg-[var(--color-secondary)] border-[var(--color-secondary)] text-white' : 'border-gray-300'}`}>
      {item.done && <span className="text-xs">✓</span>}
    </button>

    <div className="flex-1 min-w-0 ml-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`font-medium text-sm break-all min-w-0 transition-colors ${item.done ? 'line-through text-gray-400' : 'text-[var(--color-text)]'}`}>{item.name}</span>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--color-bg)] text-[var(--color-secondary)] whitespace-nowrap">{item.qtyStr}</span>
      </div>
      {item.note && <p className="text-xs text-gray-400 mt-1 break-words whitespace-pre-wrap min-w-0">{item.note}</p>}
      
      <div className="mt-3 flex flex-col gap-1">
          <div className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
               <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Added by {item.owner}
          </div>
          {item.done && item.completedBy && (
               <div className="text-[10px] text-[var(--color-secondary)] flex items-center gap-1 font-bold">
                   <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)]"></span> ✓ Marked Done by {item.completedBy}
               </div>
          )}
      </div>
    </div>

    <div className="flex items-center gap-2 shrink-0 ml-2">
      <span className="text-gray-300 text-xs">✎</span>
    </div>
  </div>
);

export default GroceryItem;
