import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// Async thunk untuk mengambil data dari cookie
export const fetchAuthUser = createAsyncThunk(
  "auth/fetchAuthUser",
  async () => {
    const cookies = document.cookie.split("; ");
    const authTokenCookie = cookies.find((row) => row.startsWith("authBMFK="));

    if (authTokenCookie) {
      const token = authTokenCookie.split("=")[1];
      try {
        const decodedToken: any = jwtDecode(token);
        return {
          dataUser: decodedToken,
          roleUser: decodedToken.role,
        };
      } catch (error) {
        console.error("Invalid token:", error);
        throw error;
      }
    } else {
      throw new Error("No auth token found");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { dataUser: null, roleUser: null, status: "idle" },
  reducers: {
    resetState: () => ({
      dataUser: null,
      roleUser: null,
      status: "idle",
      error: null,
    }), // Reset state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.dataUser = action.payload.dataUser;
        state.roleUser = action.payload.roleUser;
        state.status = "succeeded";
      })
      .addCase(fetchAuthUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});
export const { resetState } = authSlice.actions;
export default authSlice.reducer;
