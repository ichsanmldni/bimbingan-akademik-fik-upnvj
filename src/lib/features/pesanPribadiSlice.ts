import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Ganti dengan base URL yang benar

export const fetchPesanPribadi = createAsyncThunk(
  "chat/fetchPesanPribadi",
  async ({ roleUser, userId }: { userId: number; roleUser: string }) => {
    const response = await axios.get(`${API_BASE_URL}/api/chatpribadi`);
    if (roleUser === "Dosen PA") {
      return response.data.filter((data) => data.dosen_pa_id === userId);
    } else if (roleUser === "Mahasiswa") {
      return response.data.filter((data) => data.mahasiswa_id === userId);
    }
  }
);

const pesanPribadiSlice = createSlice({
  name: "pesanPribadi",
  initialState: {
    data: [],
    isPesanPribadiDosenPAUnread: false,
    isPesanPribadiMahasiswaUnread: false,
    loading: false,
    error: null,
  },
  reducers: {
    resetState: () => ({
      data: [],
      isPesanPribadiDosenPAUnread: false,
      isPesanPribadiMahasiswaUnread: false,
      loading: false,
      error: null,
    }), // Reset state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPesanPribadi.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPesanPribadi.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;

        const pesanPribadiUser = action.payload.find(
          (data) => data.mahasiswa_id
        );
        state.isPesanPribadiDosenPAUnread =
          !pesanPribadiUser?.is_mahasiswa_pesan_terakhir_read;

        const isDosenPAReadAll = action.payload.every(
          (data) => data.is_dosenpa_pesan_terakhir_read === true
        );
        state.isPesanPribadiMahasiswaUnread = !isDosenPAReadAll;
      })
      .addCase(fetchPesanPribadi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetState } = pesanPribadiSlice.actions;
export default pesanPribadiSlice.reducer;
