import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createCategory,
  createAccount,
  updateAccount as updateAccountApi,
  updateProfile,
  updateHouseholdSettings,
} from '../../services/householdData';

export const saveProfile = createAsyncThunk(
  'config/saveProfile',
  async (profile, { getState, rejectWithValue }) => {
    try {
      const userId = getState().auth.user?.id;
      if (!userId) throw new Error('Not authenticated');
      return await updateProfile(userId, profile);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveMonthlyBudget = createAsyncThunk(
  'config/saveBudget',
  async (budget, { getState, rejectWithValue }) => {
    try {
      const householdId = getState().household.household?.id;
      if (!householdId) throw new Error('No household loaded');
      await updateHouseholdSettings(householdId, { monthlyBudget: budget });
      return budget;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveTheme = createAsyncThunk(
  'config/saveTheme',
  async (theme, { getState, rejectWithValue }) => {
    try {
      const householdId = getState().household.household?.id;
      if (!householdId) throw new Error('No household loaded');
      await updateHouseholdSettings(householdId, { theme });
      return theme;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addCategoryRemote = createAsyncThunk(
  'config/addCategory',
  async (category, { getState, rejectWithValue }) => {
    try {
      const householdId = getState().household.household?.id;
      if (!householdId) throw new Error('No household loaded');
      return await createCategory(householdId, category);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addAccountRemote = createAsyncThunk(
  'config/addAccount',
  async (account, { getState, rejectWithValue }) => {
    try {
      const householdId = getState().household.household?.id;
      if (!householdId) throw new Error('No household loaded');
      return await createAccount(householdId, account);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleAccountRemote = createAsyncThunk(
  'config/toggleAccount',
  async (id, { getState, rejectWithValue }) => {
    try {
      const account = getState().config.accounts.find((a) => a.id === id);
      if (!account) throw new Error('Account not found');
      return await updateAccountApi(id, { ...account, active: !account.active });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const configSlice = createSlice({
  name: 'config',
  initialState: {
    monthlyBudget: 60000,
    currentUser: { id: null, name: '', color: '#6E8E75' },
    categories: [],
    accounts: [],
  },
  reducers: {
    hydrateConfig: (state, action) => {
      Object.assign(state, action.payload);
    },
    setMonthlyBudget: (state, action) => {
      state.monthlyBudget = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    upsertCategory: (state, action) => {
      const idx = state.categories.findIndex((c) => c.id === action.payload.id);
      if (idx === -1) state.categories.push(action.payload);
      else state.categories[idx] = action.payload;
    },
    setAccounts: (state, action) => {
      state.accounts = action.payload;
    },
    upsertAccount: (state, action) => {
      const idx = state.accounts.findIndex((a) => a.id === action.payload.id);
      if (idx === -1) state.accounts.push(action.payload);
      else state.accounts[idx] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(saveMonthlyBudget.fulfilled, (state, action) => {
        state.monthlyBudget = action.payload;
      })
      .addCase(addCategoryRemote.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(addAccountRemote.fulfilled, (state, action) => {
        state.accounts.push(action.payload);
      })
      .addCase(toggleAccountRemote.fulfilled, (state, action) => {
        const idx = state.accounts.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) state.accounts[idx] = action.payload;
      });
  },
});

export const {
  hydrateConfig,
  setMonthlyBudget,
  setCurrentUser,
  setCategories,
  upsertCategory,
  setAccounts,
  upsertAccount,
} = configSlice.actions;

export default configSlice.reducer;
