import './TaskItem.scss';

const TaskItem = ({ task, onToggle, onEdit }) => (
  <div className={`bg-[var(--color-surface)] rounded-2xl border border-gray-100 shadow-sm transition-all overflow-hidden cursor-pointer hover:bg-gray-50 ${task.done ? 'opacity-70' : ''}`} onClick={onEdit}>
    <div className="flex items-start p-4">
      <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${task.done ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : 'border-gray-300'}`}>
        {task.done && <span className="text-xs">✓</span>}
      </button>
      
      <div className="flex-1 min-w-0 ml-3">
        <div className={`font-medium text-sm break-words whitespace-pre-wrap min-w-0 ${task.done ? 'line-through text-gray-400' : 'text-[var(--color-text)]'}`}>{task.title}</div>
        {task.desc && <div className="text-xs text-gray-400 mt-1 break-words whitespace-pre-wrap min-w-0">{task.desc}</div>}
        
        <div className="mt-3 flex flex-col gap-1">
            <div className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Added by {task.owner}
            </div>
            
            {/* Show assigned user if not done */}
            {!task.done && task.assignedToName && (
               <div className="text-[10px] text-[var(--color-accent-blue)] flex items-center gap-1 font-bold">
                   <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-blue)]"></span> Assigned to {task.assignedToName}
               </div>
            )}
            
            {task.done && task.completedBy && (
               <div className="text-[10px] text-[var(--color-primary)] flex items-center gap-1 font-bold">
                   <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span> ✓ Marked Done by {task.completedBy}
               </div>
            )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 ml-2 shrink-0">
        <span className="text-gray-300 text-xs">✎</span>
      </div>
    </div>
  </div>
);

export default TaskItem;