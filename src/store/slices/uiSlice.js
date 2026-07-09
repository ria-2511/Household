import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'dashboard',
  toastMsg: '',
  isCreatingRecipe: false,
  theme: 'sage-sand',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setToastMsg: (state, action) => {
      state.toastMsg = action.payload;
    },
    clearToast: (state) => {
      state.toastMsg = '';
    },
    setIsCreatingRecipe: (state, action) => {
      state.isCreatingRecipe = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { setActiveTab, setToastMsg, clearToast, setIsCreatingRecipe, setTheme } = uiSlice.actions;

export const showToast = (msg) => (dispatch) => {
  dispatch(setToastMsg(msg));
  setTimeout(() => dispatch(clearToast()), 2500);
};

export default uiSlice.reducer;
