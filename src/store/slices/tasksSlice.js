import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createTask, updateTask as updateTaskApi, deleteTask as deleteTaskApi } from '../../services/householdData';
import { getFirstName } from '../../helpers';

export const saveTask = createAsyncThunk(
  'tasks/save',
  async ({ task, isEdit }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const householdId = state.household.household?.id;
      const userId = state.auth.user?.id;
      const ownerName = getFirstName(state.config.currentUser);
      if (!householdId || !userId) throw new Error('No household loaded');

      if (isEdit) {
        return await updateTaskApi(task.id, task);
      }
      return await createTask(householdId, userId, ownerName, task);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeTask = createAsyncThunk(
  'tasks/remove',
  async (id, { rejectWithValue }) => {
    try {
      await deleteTaskApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleTaskRemote = createAsyncThunk(
  'tasks/toggle',
  async ({ id, completedByName }, { getState, rejectWithValue }) => {
    try {
      const task = getState().tasks.items.find((t) => t.id === id);
      if (!task) throw new Error('Task not found');
      const newDone = !task.done;
      return await updateTaskApi(id, {
        ...task,
        done: newDone,
        completedBy: newDone ? completedByName : null,
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { items: [], saving: false },
  reducers: {
    setTasks: (state, action) => {
      state.items = action.payload;
    },
    upsertTask: (state, action) => {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx === -1) state.items.unshift(action.payload);
      else state.items[idx] = action.payload;
    },
    removeTaskById: (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx === -1) state.items.unshift(action.payload);
        else state.items[idx] = action.payload;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(toggleTaskRemote.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { setTasks, upsertTask, removeTaskById } = tasksSlice.actions;
export default tasksSlice.reducer;
