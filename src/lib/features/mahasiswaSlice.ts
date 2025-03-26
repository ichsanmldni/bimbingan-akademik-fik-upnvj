import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Ganti dengan base URL yang benar

// Thunk untuk fetch data mahasiswa
export const fetchMahasiswa = createAsyncThunk(
  "mahasiswa/fetchMahasiswa",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/datamahasiswa`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Terjadi kesalahan saat mengambil data."
      );
    }
  }
);

// Thunk untuk update data mahasiswa
export const updateMahasiswa = createAsyncThunk(
  "mahasiswa/updateMahasiswa",
  async (updatedData: any, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/datamahasiswa`,
        updatedData
      );

      const data = await response.data.json();

      if (!response.data.ok) {
        return rejectWithValue(
          data.message || "Gagal memperbarui data mahasiswa"
        );
      }
      return data; // Mengembalikan data yang diperbarui
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Terjadi kesalahan saat memperbarui data."
      );
    }
  }
);

const mahasiswaSlice = createSlice({
  name: "mahasiswa",
  initialState: {
    data: [],
    status: "idle", // idle | loading | succeeded | failed
    updateStatus: "idle", // Untuk tracking status update
    error: null,
    updateError: null,
  },
  reducers: {
    resetState: () => ({
      data: [],
      status: "idle", // idle | loading | succeeded | failed
      updateStatus: "idle", // Untuk tracking status update
      error: null,
      updateError: null,
    }), // Reset state
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchMahasiswa
      .addCase(fetchMahasiswa.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMahasiswa.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchMahasiswa.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Handle updateMahasiswa
      .addCase(updateMahasiswa.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateMahasiswa.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        // Update data di state sesuai dengan yang diperbarui
        state.data = state.data.map((mahasiswa: any) =>
          mahasiswa.id === action.payload.id ? action.payload : mahasiswa
        );
      })
      .addCase(updateMahasiswa.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload as string;
      });
  },
});

export const { resetState } = mahasiswaSlice.actions;
export default mahasiswaSlice.reducer;
