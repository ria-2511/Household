import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { upsertMenuPlan, deleteMenuPlan as deleteMenuPlanApi } from '../../services/householdData';

export const assignMealRemote = createAsyncThunk(
  'menuPlan/assign',
  async ({ day, meal, recipeId }, { getState, rejectWithValue }) => {
    try {
      const householdId = getState().household.household?.id;
      if (!householdId) throw new Error('No household loaded');
      await upsertMenuPlan(householdId, day, meal, recipeId);
      return { day, meal, recipeId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const clearMealRemote = createAsyncThunk(
  'menuPlan/clear',
  async ({ day, meal }, { getState, rejectWithValue }) => {
    try {
      const householdId = getState().household.household?.id;
      if (!householdId) throw new Error('No household loaded');
      await deleteMenuPlanApi(householdId, day, meal);
      return { day, meal };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const menuPlanSlice = createSlice({
  name: 'menuPlan',
  initialState: { plan: {} },
  reducers: {
    setMenuPlan: (state, action) => {
      state.plan = action.payload;
    },
    upsertMenuPlanEntry: (state, action) => {
      const { day, meal, recipeId } = action.payload;
      if (!state.plan[day]) state.plan[day] = {};
      state.plan[day][meal] = recipeId;
    },
    removeMenuPlanEntry: (state, action) => {
        const { day, meal } = action.payload;
        if (state.plan[day]) {
            delete state.plan[day][meal];
        }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignMealRemote.fulfilled, (state, action) => {
        const { day, meal, recipeId } = action.payload;
        if (!state.plan[day]) state.plan[day] = {};
        state.plan[day][meal] = recipeId;
      })
      .addCase(clearMealRemote.fulfilled, (state, action) => {
        const { day, meal } = action.payload;
        if (state.plan[day]) {
            delete state.plan[day][meal];
        }
      });
  },
});

export const { setMenuPlan, upsertMenuPlanEntry, removeMenuPlanEntry } = menuPlanSlice.actions;
export default menuPlanSlice.reducer;