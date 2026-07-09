import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createGrocery, updateGrocery as updateGroceryApi, deleteGrocery as deleteGroceryApi } from '../../services/householdData';
import { getFirstName } from '../../helpers';

export const saveGrocery = createAsyncThunk(
  'groceries/save',
  async ({ item, isEdit }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const householdId = state.household.household?.id;
      const userId = state.auth.user?.id;
      const ownerName = getFirstName(state.config.currentUser);
      if (!householdId || !userId) throw new Error('No household loaded');
      if (isEdit) return await updateGroceryApi(item.id, item);
      return await createGrocery(householdId, userId, ownerName, item);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeGrocery = createAsyncThunk(
  'groceries/remove',
  async (id, { rejectWithValue }) => {
    try {
      await deleteGroceryApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleGroceryRemote = createAsyncThunk(
  'groceries/toggle',
  async ({ id, completedByName }, { getState, rejectWithValue }) => {
    try {
      const item = getState().groceries.items.find((g) => g.id === id);
      if (!item) throw new Error('Item not found');
      const newDone = !item.done;
      return await updateGroceryApi(id, {
        ...item,
        done: newDone,
        completedBy: newDone ? completedByName : null,
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const groceriesSlice = createSlice({
  name: 'groceries',
  initialState: { items: [] },
  reducers: {
    setGroceries: (state, action) => {
      state.items = action.payload;
    },
    upsertGrocery: (state, action) => {
      const idx = state.items.findIndex((g) => g.id === action.payload.id);
      if (idx === -1) state.items.unshift(action.payload);
      else state.items[idx] = action.payload;
    },
    removeGroceryById: (state, action) => {
      state.items = state.items.filter((g) => g.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveGrocery.fulfilled, (state, action) => {
        const idx = state.items.findIndex((g) => g.id === action.payload.id);
        if (idx === -1) state.items.unshift(action.payload);
        else state.items[idx] = action.payload;
      })
      .addCase(removeGrocery.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => g.id !== action.payload);
      })
      .addCase(toggleGroceryRemote.fulfilled, (state, action) => {
        const idx = state.items.findIndex((g) => g.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { setGroceries, upsertGrocery, removeGroceryById } = groceriesSlice.actions;
export default groceriesSlice.reducer;
