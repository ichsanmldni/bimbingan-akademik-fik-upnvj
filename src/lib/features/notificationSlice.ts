import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Ganti dengan base URL yang benar

export const fetchNotifikasi = createAsyncThunk(
  "notifications/fetchNotifikasi",
  async ({ roleUser, userId }: { roleUser: string; userId: number }) => {
    let url = "";
    if (roleUser === "Mahasiswa") {
      url = `${API_BASE_URL}/api/datanotifikasimahasiswa`;
    } else if (roleUser === "Dosen PA") {
      url = `${API_BASE_URL}/api/datanotifikasidosenpa`;
    } else if (roleUser === "Kaprodi") {
      url = `${API_BASE_URL}/api/datanotifikasikaprodi`;
    }

    const response = await axios.get(url);
    return response.data.filter(
      (data) =>
        data[`${roleUser.toLowerCase().replace(/\s+/g, "_")}_id`] === userId
    );
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetState: () => ({
      data: [],
      loading: false,
      error: null,
    }), // Reset state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifikasi.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifikasi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchNotifikasi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetState } = notificationSlice.actions;
export default notificationSlice.reducer;
