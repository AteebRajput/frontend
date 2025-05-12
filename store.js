import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from "./slices/userSlice.js"
import {productReducer} from "./slices/productSlice.js"
import { auctionReducer } from './slices/auctionSlice.js';
import { analyticsReducer } from './slices/analyticsSlice.js';
import orderReducer from './slices/orderSlice.js';

const store = configureStore({
  reducer: {
    user: userReducer, // Add other slices here
    products: productReducer,
    auctions: auctionReducer,
    orders: orderReducer,
    analytics: analyticsReducer,
  },
});

export default store;
