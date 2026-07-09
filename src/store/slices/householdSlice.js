import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchHouseholdContext,
  previewHouseholdByCode,
  joinHouseholdByCode,
  regenerateJoinCode,
  removeHouseholdMember,
  updateHouseholdName,
  fetchAllHouseholdData,
  fetchProfile,
  subscribeToHousehold,
  unsubscribeFromHousehold,
} from '../../services/householdData';
import {
  mapTask,
  mapGrocery,
  mapRecipe,
  mapExpense,
  mapCategory,
  mapAccount,
} from '../../services/mappers';
import { setTasks, upsertTask, removeTaskById } from './tasksSlice';
import { setGroceries, upsertGrocery, removeGroceryById } from './groceriesSlice';
import { setRecipes, upsertRecipe, removeRecipeById } from './recipesSlice';
import { setExpenses, upsertExpense, removeExpenseById } from './expensesSlice';
import { setMenuPlan, upsertMenuPlanEntry } from './menuPlanSlice';
import {
  hydrateConfig,
  upsertCategory,
  upsertAccount,
  setMonthlyBudget,
} from './configSlice';
import { setTheme } from './uiSlice';

export const loadHousehold = createAsyncThunk(
  'household/load',
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      const context = await fetchHouseholdContext(userId);
      if (context.needsJoin) {
        return { ...context, data: null };
      }

      const [data, profile] = await Promise.all([
        fetchAllHouseholdData(context.household.id),
        fetchProfile(userId),
      ]);

      dispatch(hydrateConfig({
        currentUser: profile,
        categories: data.categories,
        accounts: data.accounts,
        monthlyBudget: data.monthlyBudget,
      }));
      dispatch(setTasks(data.tasks));
      dispatch(setGroceries(data.groceries));
      dispatch(setRecipes(data.recipes));
      dispatch(setExpenses(data.expenses));
      dispatch(setMenuPlan(data.menuPlan));
      dispatch(setTheme(data.theme));

      return { ...context, data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const previewJoinCode = createAsyncThunk(
  'household/previewJoinCode',
  async (code, { rejectWithValue }) => {
    try {
      return await previewHouseholdByCode(code);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const joinHousehold = createAsyncThunk(
  'household/join',
  async ({ code, userId }, { dispatch, rejectWithValue }) => {
    try {
      await joinHouseholdByCode(code);
      return dispatch(loadHousehold(userId)).unwrap();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const regenerateCode = createAsyncThunk(
  'household/regenerateCode',
  async (householdId, { rejectWithValue }) => {
    try {
      return await regenerateJoinCode(householdId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeMember = createAsyncThunk(
  'household/removeMember',
  async ({ householdId, userId }, { dispatch, rejectWithValue, getState }) => {
    try {
      await removeHouseholdMember(householdId, userId);
      const authUserId = getState().auth.user?.id;
      return dispatch(loadHousehold(authUserId)).unwrap();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const renameHousehold = createAsyncThunk(
  'household/rename',
  async ({ householdId, name }, { rejectWithValue }) => {
    try {
      const data = await updateHouseholdName(householdId, name);
      return data.name;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const startRealtimeSync = createAsyncThunk(
  'household/startRealtime',
  async (householdId, { dispatch }) => {
    subscribeToHousehold(householdId, {
      onTasks: (payload) => {
        if (payload.eventType === 'DELETE') dispatch(removeTaskById(payload.old.id));
        else dispatch(upsertTask(mapTask(payload.new)));
      },
      onGroceries: (payload) => {
        if (payload.eventType === 'DELETE') dispatch(removeGroceryById(payload.old.id));
        else dispatch(upsertGrocery(mapGrocery(payload.new)));
      },
      onRecipes: (payload) => {
        if (payload.eventType === 'DELETE') dispatch(removeRecipeById(payload.old.id));
        else dispatch(upsertRecipe(mapRecipe(payload.new)));
      },
      onExpenses: (payload) => {
        if (payload.eventType === 'DELETE') dispatch(removeExpenseById(payload.old.id));
        else dispatch(upsertExpense(mapExpense(payload.new)));
      },
      onMenuPlans: (payload) => {
        if (payload.eventType === 'DELETE') return;
        dispatch(upsertMenuPlanEntry({
          day: payload.new.day_abbr,
          meal: payload.new.meal,
          recipeId: payload.new.recipe_id,
        }));
      },
      onCategories: (payload) => {
        if (payload.eventType === 'DELETE') return;
        dispatch(upsertCategory(mapCategory(payload.new)));
      },
      onAccounts: (payload) => {
        if (payload.eventType === 'DELETE') return;
        dispatch(upsertAccount(mapAccount(payload.new)));
      },
      onSettings: (payload) => {
        if (payload.new?.monthly_budget != null) {
          dispatch(setMonthlyBudget(Number(payload.new.monthly_budget)));
        }
        if (payload.new?.theme) dispatch(setTheme(payload.new.theme));
      },
      onMembers: () => {
        // Members list refreshed on next settings visit or manual reload
      },
    });
    return householdId;
  }
);

export const stopRealtimeSync = createAsyncThunk('household/stopRealtime', async () => {
  unsubscribeFromHousehold();
});

const householdSlice = createSlice({
  name: 'household',
  initialState: {
    household: null,
    members: [],
    joinCode: null,
    needsJoin: false,
    loading: false,
    error: null,
    joinPreview: null,
  },
  reducers: {
    clearHouseholdError: (state) => {
      state.error = null;
    },
    clearJoinPreview: (state) => {
      state.joinPreview = null;
    },
    resetHousehold: (state) => {
      state.household = null;
      state.members = [];
      state.joinCode = null;
      state.needsJoin = false;
      state.joinPreview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadHousehold.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadHousehold.fulfilled, (state, action) => {
        state.loading = false;
        state.needsJoin = action.payload.needsJoin;
        state.household = action.payload.household;
        state.members = action.payload.members || [];
        state.joinCode = action.payload.joinCode;
      })
      .addCase(loadHousehold.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(previewJoinCode.fulfilled, (state, action) => {
        state.joinPreview = action.payload;
      })
      .addCase(joinHousehold.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinHousehold.fulfilled, (state, action) => {
        state.loading = false;
        state.needsJoin = false;
        state.household = action.payload.household;
        state.members = action.payload.members || [];
        state.joinCode = action.payload.joinCode;
        state.joinPreview = null;
      })
      .addCase(joinHousehold.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(regenerateCode.fulfilled, (state, action) => {
        state.joinCode = action.payload;
        if (state.household) state.household.joinCode = action.payload;
      })
      .addCase(renameHousehold.fulfilled, (state, action) => {
        if (state.household) state.household.name = action.payload;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.household = action.payload.household;
        state.members = action.payload.members || [];
        state.joinCode = action.payload.joinCode;
      });
  },
});

export const { clearHouseholdError, clearJoinPreview, resetHousehold } = householdSlice.actions;
export default householdSlice.reducer;
