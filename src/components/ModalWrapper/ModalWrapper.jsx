import './ModalWrapper.scss';

const ModalWrapper = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-50 flex justify-center items-end bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-[var(--color-surface)] w-full max-h-[90vh] overflow-y-auto rounded-t-3xl p-6 shadow-2xl animate-[slideUp_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[var(--color-text)]">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 font-bold hover:bg-gray-200">×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
