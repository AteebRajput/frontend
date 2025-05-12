import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// local backend url
// const API_URL = "http://localhost:5000/api/analytics";
const API_URL = "https://backend-production-c261.up.railway.app/api/analytics";

// Fetch all sellers analytics
export const fetchAllSellersAnalytics = createAsyncThunk(
  "analytics/fetchAllSellersAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/sellers`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch detailed analytics for a specific seller
export const fetchSellerDetailedAnalytics = createAsyncThunk(
  "analytics/fetchSellerDetailedAnalytics",
  async (sellerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/sellers/${sellerId}`);
      console.log(response.data);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial state
const initialState = {
  sellersAnalytics: [],
  sellerDetailedAnalytics: {},
  loading: false,
  error: null,
};

// Create slice
const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // All Sellers Analytics
      .addCase(fetchAllSellersAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSellersAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.sellersAnalytics = action.payload?.data || [];
      })
      .addCase(fetchAllSellersAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Specific Seller Analytics
      .addCase(fetchSellerDetailedAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerDetailedAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerDetailedAnalytics = action.payload?.data || {};
      })
      .addCase(fetchSellerDetailedAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = analyticsSlice.actions;
export const analyticsReducer = analyticsSlice.reducer;
