import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// const ORDER_API = "http://localhost:5000/api/order";
const ORDER_API = "https://backend-production-c261.up.railway.app/api/order";

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const userId = JSON.parse(localStorage.getItem("userId"))?.userId;
  const response = await axios.get(`${ORDER_API}/get-user-orders/${userId}`);

  console.log("Response is:", response.data);


  return response.data;
});

// Create Order Async Thunk
export const createOrder = createAsyncThunk(
  "auction/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ORDER_API}/place-order`, orderData);
      if (response.status == 201) {
        toast.success("Order Placed Successfully!", {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "dark",
        });
      }
      return response.data;
    } catch (error) {
      console.log("Order error:", error); // Log any errors
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete order async thunk
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      console.log("Deleting order with ID:", orderId);
      const response = await axios.delete(`${ORDER_API}/delete-order/${orderId}`);

      if (response.status === 200) {
        toast.success("Order Deleted Successfully!", {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "dark",
        });
      }

      return { orderId };
    } catch (error) {
      console.error("Delete order error:", error);

      const errorMessage =
        error.response?.data?.error || "Failed to delete the order.";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "light",
      });

      return rejectWithValue(errorMessage);
    }
  }
);


export const fetchFarmerOrders = createAsyncThunk(
  "farmerOrders/fetchFarmerOrders",
  async (_, { rejectWithValue }) => {
    const farmerId = JSON.parse(localStorage.getItem("userId"))?.userId;
    try {
      const response = await axios.get(`${ORDER_API}/get-orders/${farmerId}`);
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch orders."
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${ORDER_API}/${orderId}/status`, {
        status,
      });
      if(response.status === 200){
        toast.success("Order Updated Successfully!", {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "dark",
        });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Failed to update order status."
      );
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: { orders: [], orderStatus: false, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload.order;
        const index = state.orders.findIndex(
          (order) => order._id === updatedOrder._id
        );
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(fetchFarmerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchFarmerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Order Async Thunk Handlers

      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orderStatus = true;
        // Add the new order to the orders array
        if (action.payload && action.payload.order) {
          state.orders = [...state.orders, action.payload.order];
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload.orderId
        );
      })
      .addCase(deleteOrder.rejected, () => {
        // state.loading = false;
        // state.error = action.payload;
      });

  },
});

const orderReducer = ordersSlice.reducer;
export default orderReducer;
