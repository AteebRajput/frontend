// productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const PRODUCT_API_URL = "http://localhost:5000/api/product";
const PRODUCT_API_URL = "https://backend-production-c261.up.railway.app/api/product";

export const fetchAllTheProducts = createAsyncThunk(
  "products/fetchAllTheProducts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${PRODUCT_API_URL}/get-all-products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (userId, { rejectWithValue }) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${PRODUCT_API_URL}/get-all-products/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to Authorization header
          },
          withCredentials: true, // This ensures cookies are sent with the request
        }
      );

      return response.data; // Return the data on success
    } catch (error) {
      // Return the error message if something goes wrong
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${PRODUCT_API_URL}/update-product/${productData.id}`,
        productData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`${PRODUCT_API_URL}/delete-product/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const initialState = {
  products: [],
  totalProducts: 0,
  loading: false,
  error: null,
  selectedProduct: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.error = null;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.selectedProduct = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        state.totalProducts -= 1;
      })
      .addCase(fetchAllTheProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTheProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.error = null;
      })
      .addCase(fetchAllTheProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedProduct, clearSelectedProduct } =
  productSlice.actions;
export const productReducer = productSlice.reducer;
