import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// local backend url
// const AUCTION_api = "http://localhost:5000/api/auction";
const AUCTION_api = "https://backend-production-c261.up.railway.app/api/auction";
const BID_API = "https://backend-production-c261.up.railway.app/api/bid";
// const ORDER_API = "https://backend-production-c261.up.railway.app/api/order";/

// Async thunk to fetch auctions

export const fetchAuctions = createAsyncThunk(
  "auctions/fetchAuctions",
  async (_, { rejectWithValue }) => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId")).userId;
      // Send userId as a query parameter
      const response = await axios.get(`${AUCTION_api}/farmer-auctions`, {
        params: { userId }, // Pass userId as a query parameter
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch auctions"
      );
    }
  }
);

export const fetchAuctionBids = createAsyncThunk(
  "auctions/fetchAuctionBids",
  async (auctionId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auction/${auctionId}/bids`
      );
      console.log("API Response:", response.data); // Debugging log
      return { auctionId, bids: response.data };
    } catch (error) {
      console.error("Fetch Bids Error:", error); // Debugging log
      return rejectWithValue(
        error.response?.data || "Failed to fetch auction bids"
      );
    }
  }
);

// In auctionSlice.js
export const placeBid = createAsyncThunk(
  "auctions/placeBid",
  async (bidData, { rejectWithValue }) => {
    try {
      console.log("Bid data:", bidData);

      const response = await axios.post(`${BID_API}/place-bid`, bidData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const endAuction = createAsyncThunk(
  "auctions/endAuction",
  async ({ auctionId, ownerId }, { rejectWithValue }) => {
    console.log("Auction id", auctionId);
    console.log("Farmer id", ownerId);
    try {
      const response = await axios.post(`${AUCTION_api}/${auctionId}/end`, {
        ownerId, manualEnd:true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Place Bid Async Thunk
// export const placeBid = createAsyncThunk(
//   "auction/placeBid",
//   async (bidData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post("/api/auction/place-bid", bidData);
//       return response.data; // Assuming the response contains the updated auction info
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const fetchAuctionDetails = createAsyncThunk(
  "auctions/fetchAuctionDetails",
  async (productId) => {
    const response = await fetch(`${AUCTION_api}/auction-details/${productId}`);
    const data = await response.json();
    return data;
  }
);

export const getUserSpecifBids = createAsyncThunk(
  "auctions/getUserSpecificBids",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BID_API}/get-bids/${userId}`);
      // console.log("API response",response.data);
      if (response.status === 404) {
        throw new Error("Failed to fetch bids.");
        // return rejectWithValue("No bids found for this user.");
      }
      console.log("API Response:", response.data); // Debugging log
      return response.data; // ✅ Use response.data instead of response.json()

    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch user bids"
      );
    }
  }
);

const auctionSlice = createSlice({
  name: "auctions",
  initialState: {
    auctions: [],
    loading: false,
    error: null,
    auctionBids: {},
    bids: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch auctions
      .addCase(fetchAuctions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuctions.fulfilled, (state, action) => {
        state.loading = false;
        state.auctions = action.payload;
      })
      .addCase(fetchAuctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // End auction
      .addCase(endAuction.fulfilled, (state, action) => {
        const { auctionId, winner } = action.payload;
        const auction = state.auctions.find(
          (auction) => auction.id === auctionId
        );
        if (auction) {
          auction.status = "ended";
          auction.winner = winner;
        }
      })
      .addCase(endAuction.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchAuctionBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuctionBids.fulfilled, (state, action) => {
        state.loading = false;

        const { auctionId, bids } = action.payload;

        // Update auctionBids state
        state.auctionBids = {
          ...state.auctionBids,
          [auctionId]: bids,
        };

        console.log("Fulfilled Action:", action.payload);
      })

      .addCase(fetchAuctionBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(placeBid.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeBid.fulfilled, (state, action) => {
        state.loading = false;
        // Update auctions in the store with the new bid
        const updatedAuction = action.payload.auction;
        const auctionIndex = state.auctions.findIndex(
          (auction) => auction._id === updatedAuction._id
        );
        if (auctionIndex !== -1) {
          state.auctions[auctionIndex] = updatedAuction;
        }
      })
      .addCase(placeBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserSpecifBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserSpecifBids.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Redux: API Response Data:", action.payload);
      
        if (action.payload?.bids) {
          // ✅ Filter out bids with null productId
          const validBids = action.payload.bids.filter(bid => bid.productId !== null);
      
          state.bids = validBids;
          console.log("Redux: Valid Bids stored in state:", state.bids);
        } else {
          state.bids = [];
          console.error("Redux: No bids found in response");
        }
      })
      
      .addCase(getUserSpecifBids.rejected, (state) => {
        state.loading = false;
        state.error = true;
        state.bids = [];
      })

      .addCase(fetchAuctionDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuctionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.auctionDetails = action.payload;
      })
      .addCase(fetchAuctionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const auctionReducer = auctionSlice.reducer;

// export default auctionSlice.reducer;
