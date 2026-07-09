import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createExpense, updateExpense as updateExpenseApi, deleteExpense as deleteExpenseApi } from '../../services/householdData';
import { getFirstName } from '../../helpers';

export const saveExpense = createAsyncThunk(
  'expenses/save',
  async ({ expense, isEdit }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const householdId = state.household.household?.id;
      const userId = state.auth.user?.id;
      const ownerName = getFirstName(state.config.currentUser);
      if (!householdId || !userId) throw new Error('No household loaded');
      if (isEdit) return await updateExpenseApi(expense.id, expense);
      return await createExpense(householdId, userId, ownerName, expense);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeExpense = createAsyncThunk(
  'expenses/remove',
  async (id, { rejectWithValue }) => {
    try {
      await deleteExpenseApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: { items: [] },
  reducers: {
    setExpenses: (state, action) => {
      state.items = action.payload;
    },
    upsertExpense: (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx === -1) state.items.unshift(action.payload);
      else state.items[idx] = action.payload;
    },
    removeExpenseById: (state, action) => {
      state.items = state.items.filter((e) => e.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveExpense.fulfilled, (state, action) => {
        const idx = state.items.findIndex((e) => e.id === action.payload.id);
        if (idx === -1) state.items.unshift(action.payload);
        else state.items[idx] = action.payload;
      })
      .addCase(removeExpense.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => e.id !== action.payload);
      });
  },
});

export const { setExpenses, upsertExpense, removeExpenseById } = expensesSlice.actions;
export default expensesSlice.reducer;
