import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Ganti dengan base URL yang benar

export const fetchDosenPA = createAsyncThunk(
  "dosenPA/fetchDosenPA",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datadosenpa`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Gagal mengambil data dosen PA"
      );
    }
  }
);

const dosenPASlice = createSlice({
  name: "dosenPA",
  initialState: { data: [], status: "idle", error: null },
  reducers: {
    resetState: () => ({ data: [], status: "idle", error: null }), // Reset state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDosenPA.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDosenPA.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchDosenPA.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetState } = dosenPASlice.actions;
export default dosenPASlice.reducer;
