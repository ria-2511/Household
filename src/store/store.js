import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import householdReducer from './slices/householdSlice';
import configReducer from './slices/configSlice';
import tasksReducer from './slices/tasksSlice';
import groceriesReducer from './slices/groceriesSlice';
import recipesReducer from './slices/recipesSlice';
import expensesReducer from './slices/expensesSlice';
import menuPlanReducer from './slices/menuPlanSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    household: householdReducer,
    config: configReducer,
    tasks: tasksReducer,
    groceries: groceriesReducer,
    recipes: recipesReducer,
    expenses: expensesReducer,
    menuPlan: menuPlanReducer,
  },
});
