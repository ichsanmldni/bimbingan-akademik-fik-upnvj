import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Ganti dengan base URL yang benar

export const fetchKaprodi = createAsyncThunk(
  "kaprodi/fetchKaprodi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datakaprodi`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengambil data Kaprodi"
      );
    }
  }
);

const kaprodiSlice = createSlice({
  name: "kaprodi",
  initialState: { data: [], status: "idle", error: null },
  reducers: {
    resetState: () => ({ data: [], status: "idle", error: null }), // Reset state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKaprodi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchKaprodi.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchKaprodi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetState } = kaprodiSlice.actions;
export default kaprodiSlice.reducer;
