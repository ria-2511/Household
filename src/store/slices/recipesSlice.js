import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createRecipe, updateRecipe as updateRecipeApi, deleteRecipe as deleteRecipeApi } from '../../services/householdData';
import { getFirstName } from '../../helpers';

export const saveRecipe = createAsyncThunk(
  'recipes/save',
  async ({ recipe, isEdit }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const householdId = state.household.household?.id;
      const userId = state.auth.user?.id;
      const ownerName = getFirstName(state.config.currentUser);
      if (!householdId || !userId) throw new Error('No household loaded');
      if (isEdit) return await updateRecipeApi(recipe.id, recipe);
      return await createRecipe(householdId, userId, ownerName, recipe);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeRecipe = createAsyncThunk(
  'recipes/remove',
  async (id, { rejectWithValue }) => {
    try {
      await deleteRecipeApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: { items: [] },
  reducers: {
    setRecipes: (state, action) => {
      state.items = action.payload;
    },
    upsertRecipe: (state, action) => {
      const idx = state.items.findIndex((r) => r.id === action.payload.id);
      if (idx === -1) state.items.unshift(action.payload);
      else state.items[idx] = action.payload;
    },
    removeRecipeById: (state, action) => {
      state.items = state.items.filter((r) => r.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveRecipe.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx === -1) state.items.unshift(action.payload);
        else state.items[idx] = action.payload;
      })
      .addCase(removeRecipe.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

export const { setRecipes, upsertRecipe, removeRecipeById } = recipesSlice.actions;
export default recipesSlice.reducer;
