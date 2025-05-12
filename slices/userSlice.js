import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const API_AUTH_URL = "http://localhost:5000/api/auth";
const API_AUTH_URL = "https://backend-production-c261.up.railway.app/api/auth";

const extractUserData = (userData) => {
  const {
    _id,
    name,
    email,
    phone,
    address,
    company,
    companyActivity,
    companyVAT,
    isVerified,
    language,
    nic,
    otherProducts,
    postalCode,
    preferredProducts,
    role,
    state
  } = userData.user || userData;

  return {
    _id,
    name,
    email,
    phone,
    address,
    company,
    companyActivity,
    companyVAT,
    isVerified,
    language,
    nic,
    otherProducts,
    postalCode,
    preferredProducts,
    role,
    state
  };
};


// Fetch user data
export const fetchUserData = createAsyncThunk(
  "user/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const data = JSON.parse(localStorage.getItem("userId"));
      const userId = data.userId;

      if (!data || !userId) {
        console.log("User ID not found");
        throw new Error("User ID not found in localStorage");
      }

      // Send userId as a query parameter
      const response = await axios.get(`http://localhost:5000/api/auth/getUser?userId=${userId}`);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch user data"
      );
    }
  }
);

const fetchUserName = createAsyncThunk(
  "user/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const data = JSON.parse(localStorage.getItem("userId"));
      const userId = data.userId;

      if (!data || !userId) {
        console.log("User ID not found");
        throw new Error("User ID not found in localStorage");
      }

      // Send userId as a query parameter
      const response = await axios.get(`http://localhost:5000/api/auth/getUsername?userId=${userId}`);
      return response.data.username;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch user data"
      );
    }
  }
);

// Async Thunk for sign-up
export const signupUser = createAsyncThunk(
  "user/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_AUTH_URL}/signup`, userData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to signup. Please try again.";
      return rejectWithValue(message);
    }
  }
);


export const updateUser = createAsyncThunk(
  "user/update",
  async (userData, { rejectWithValue }) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?.user?._id;
      
      if (!userId) {
        throw new Error("User ID not found");
      }

      const updateData = {
        ...userData,
        userId
      };

      const response = await axios.put(`${API_AUTH_URL}/update-user`, updateData);
      
      if (response.data.success) {
        // Extract only needed user data before storing
        const essentialData = {
          ...storedUser,
          user: extractUserData(response.data.user)
        };
        localStorage.setItem("user", JSON.stringify(essentialData));
      }
      
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);


export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_AUTH_URL}/logout`);
      
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to logout. Please try again.";
      return rejectWithValue(message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_AUTH_URL}/verify-email`, {
        code: token,
      });
      return response.data; // Expected response: { success: true, message: "Email successfully verified!" }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to verify email. Please try again.";
      return rejectWithValue(message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("User data",userData);
      
      const response = await axios.post(
        `${API_AUTH_URL}/forgot-password`,
        userData
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to send email. Please try again.";
      return rejectWithValue(message);
    }
  }
);

// reducers/authSlice.js or wherever your thunks are defined
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ userId, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_AUTH_URL}/reset-password/${userId}`, {
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);



export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_AUTH_URL}/login`, userData);

      // Assuming the token is part of the response, we extract it
      const token = response.data.token;

      // Store the token in localStorage (or sessionStorage)
      if (token) {
        localStorage.setItem("token", token);  // Or sessionStorage
      }

      // Extract essential user data
      const essentialData = {
        ...response.data,
        user: extractUserData(response.data), // You can store the user data in the Redux state too
      };

      return essentialData;
    } catch (error) {
      const message = error.response?.data?.message || "Invalid Credentials.";
      return rejectWithValue(message);
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
    status:false,
    isVerified: false,
    isLoggedIn: !!localStorage.getItem("user"), // Set to true if user data exists
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.status = true
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.isVerified = true;
        state.user = action.payload?.user || null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.isVerified = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, act) => {
        console.log("Login successful:", act.payload);  // Debugging line
        state.loading = false;
        state.user = act.payload.user;
        state.isLoggedIn = true;
        
        // Store user and token properly
        localStorage.setItem("user", JSON.stringify({ user: act.payload.user }));
        localStorage.setItem("userId", JSON.stringify({ userId: act.payload.user._id }));
        localStorage.setItem("isLoggedIn", "true");  // Set to simple string "true"
        
        // Optionally, you can also store the token
        if (act.payload.token) {
          localStorage.setItem("token", act.payload.token);
        }
      })
      
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.isVerified = false;
        state.status = "idle";
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("isLoggedIn");
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user= action.payload;
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Password reset successfully";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to reset password";
      });


  },
});

export const userReducer = userSlice.reducer;
