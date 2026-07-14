import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { saveGrocery, removeGrocery, toggleGroceryRemote } from '../../store/slices/groceriesSlice';
import { showToast } from '../../store/slices/uiSlice';
import { getFirstName } from '../../helpers';
import GroceryItem from '../../components/GroceryItem';
import GroceryModal from '../../modals/GroceryModal';
import './GroceriesView.scss';

const GroceriesView = () => {
  const dispatch = useAppDispatch();
  const groceries = useAppSelector((state) => state.groceries.items);
  const currentUser = useAppSelector((state) => state.config.currentUser);
  const saving = useAppSelector((state) => state.groceries.saving); // Fetch loading state

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleSave = async (itemData) => {
    const result = await dispatch(saveGrocery({ item: itemData, isEdit: Boolean(editingItem) }));
    if (saveGrocery.fulfilled.match(result)) {
      dispatch(showToast(editingItem ? 'Grocery item updated' : 'Added to groceries'));
      setModalOpen(false);
    } else {
      dispatch(showToast(result.payload || 'Failed to save item'));
    }
  };

  const handleToggle = async (id) => {
    const result = await dispatch(toggleGroceryRemote({ id, completedByName: getFirstName(currentUser) }));
    if (toggleGroceryRemote.rejected.match(result)) {
      dispatch(showToast(result.payload || 'Failed to update item'));
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(removeGrocery(id));
    if (removeGrocery.fulfilled.match(result)) {
      dispatch(showToast('Item deleted'));
      setModalOpen(false);
    }
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Groceries</h1>
        <p className="text-gray-500 text-sm mt-1">What we need this week</p>
      </div>

      <button onClick={openCreate} className="w-full border-2 border-dashed border-gray-300 text-gray-500 py-4 mb-4 rounded-2xl text-sm font-bold hover:bg-[var(--color-surface)] hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
        <span className="text-xl">＋</span> Add Grocery Item
      </button>

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="flex flex-col gap-3">
          {groceries.map((item) => (
            <GroceryItem key={item.id} item={item} onToggle={() => handleToggle(item.id)} onEdit={() => openEdit(item)} />
          ))}
        </div>
      </div>

      <GroceryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={editingItem ? () => handleDelete(editingItem.id) : null}
        initialData={editingItem}
        currentUser={currentUser}
        isSaving={saving}
      />
    </div>
  );
};

export default GroceriesView;