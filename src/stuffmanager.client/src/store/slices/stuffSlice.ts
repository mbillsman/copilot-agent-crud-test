import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Stuff, ApiError } from '../../types';

// Async thunk for fetching stuff
export const fetchStuff = createAsyncThunk<
  Stuff[],
  { page?: number },
  { rejectValue: ApiError }
>(
  'stuff/fetchStuff',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/stuff?page=${page}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      
      const data = await response.json();
      return data;
    } catch {
      return rejectWithValue({
        code: 'NETWORK_ERROR',
        message: 'Failed to fetch stuff items'
      });
    }
  }
);

interface StuffState {
  items: Stuff[];
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: StuffState = {
  items: [],
  currentPage: 1,
  loading: false,
  error: null,
};

const stuffSlice = createSlice({
  name: 'stuff',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStuff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStuff.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchStuff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch stuff';
      });
  },
});

export const { setCurrentPage, clearError } = stuffSlice.actions;

// Selectors
export const selectStuffItems = (state: { stuff: StuffState }) => state.stuff.items;
export const selectCurrentPage = (state: { stuff: StuffState }) => state.stuff.currentPage;
export const selectLoading = (state: { stuff: StuffState }) => state.stuff.loading;
export const selectError = (state: { stuff: StuffState }) => state.stuff.error;

export default stuffSlice.reducer;
