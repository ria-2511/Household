import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  if (!isSupabaseConfigured || !supabase) {
    return { session: null, user: null };
  }
  const { data: { session } } = await supabase.auth.getSession();
  return { session, user: session?.user ?? null };
});

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async ({ email, password, displayName }, { rejectWithValue }) => {
    if (!supabase) return rejectWithValue('Supabase not configured');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) return rejectWithValue(error.message);
    return { session: data.session, user: data.user };
  }
);

export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }, { rejectWithValue }) => {
    if (!supabase) return rejectWithValue('Supabase not configured');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return rejectWithValue(error.message);
    return { session: data.session, user: data.user };
  }
);

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    if (!supabase) return rejectWithValue('Supabase not configured');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) return rejectWithValue(error.message);
    return null;
  }
);

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  if (!supabase) return rejectWithValue('Supabase not configured');
  const { error } = await supabase.auth.signOut();
  if (error) return rejectWithValue(error.message);
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    session: null,
    user: null,
    status: 'idle',
    error: null,
    configured: isSupabaseConfigured,
  },
  reducers: {
    setAuthSession: (state, action) => {
      state.session = action.payload.session;
      state.user = action.payload.user;
      state.status = action.payload.user ? 'authenticated' : 'unauthenticated';
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.status = action.payload.user ? 'authenticated' : 'unauthenticated';
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.status = 'unauthenticated';
      })
      .addCase(signUpWithEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.status = action.payload.user ? 'authenticated' : 'unauthenticated';
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = action.payload;
      })
      .addCase(signInWithEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.status = 'authenticated';
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = action.payload;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.session = null;
        state.user = null;
        state.status = 'unauthenticated';
      });
  },
});

export const { setAuthSession, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
