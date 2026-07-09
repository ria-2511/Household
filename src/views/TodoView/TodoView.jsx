import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { saveTask, removeTask, toggleTaskRemote } from '../../store/slices/tasksSlice';
import { showToast } from '../../store/slices/uiSlice';
import { getFirstName } from '../../helpers';
import TaskItem from '../../components/TaskItem';
import TaskModal from '../../modals/TaskModal';
import './TodoView.scss';

const TodoView = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);
  const currentUser = useAppSelector((state) => state.config.currentUser);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleSave = async (taskData) => {
    const result = await dispatch(saveTask({ task: taskData, isEdit: Boolean(editingTask) }));
    if (saveTask.fulfilled.match(result)) {
      dispatch(showToast(editingTask ? 'Task updated' : 'Task added'));
      setModalOpen(false);
    } else {
      dispatch(showToast(result.payload || 'Failed to save task'));
    }
  };

  const handleToggle = async (id) => {
    const result = await dispatch(toggleTaskRemote({ id, completedByName: getFirstName(currentUser) }));
    if (toggleTaskRemote.rejected.match(result)) {
      dispatch(showToast(result.payload || 'Failed to update task'));
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(removeTask(id));
    if (removeTask.fulfilled.match(result)) {
      dispatch(showToast('Task deleted'));
      setModalOpen(false);
    }
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">To-Do List</h1>
        <p className="text-gray-500 text-sm mt-1">Shared Household Tasks</p>
      </div>

      <button onClick={openCreate} className="w-full border-2 border-dashed border-gray-300 text-gray-500 py-4 mb-4 rounded-2xl text-sm font-bold hover:bg-[var(--color-surface)] hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
        <span className="text-xl">＋</span> Add New Task
      </button>

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={() => handleToggle(task.id)} onEdit={() => openEdit(task)} />
          ))}
        </div>
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={editingTask ? () => handleDelete(editingTask.id) : null}
        initialData={editingTask}
        currentUser={currentUser}
      />
    </div>
  );
};

export default TodoView;
