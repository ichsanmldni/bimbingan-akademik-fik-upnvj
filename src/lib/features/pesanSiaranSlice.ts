import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Ganti dengan base URL yang benar

type PesanSiaran = {
  id: number;
  dosen_pa_id: number;
  pesan_terakhir: string;
  waktu_pesan_terakhir: Date;
};

// Fetch data pesan siaran
export const fetchPesanSiaran = createAsyncThunk(
  "pesanSiaran/fetchPesanSiaran",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/api/pesansiaran`);
    return response.data;
  }
);

// Fetch status pembacaan pesan siaran
export const fetchStatusPesanSiaran = createAsyncThunk(
  "pesanSiaran/fetchStatusPesanSiaran",
  async (
    { userId, dosenPaId }: { userId: number; dosenPaId: number },
    { getState }
  ) => {
    const state = getState() as RootState;
    const pesanSiaran: PesanSiaran[] = state.pesanSiaran.data;

    if (!pesanSiaran.length) {
      throw new Error("Pesan siaran belum dimuat");
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/statuspembacaanpesansiaran`
    );

    const dataMahasiswa = await axios.get(`${API_BASE_URL}/api/datamahasiswa`);
    const dataStatus = response.data;
    console.log(dataStatus);

    // Temukan pesan siaran untuk dosen
    const pesanSiaranUser = pesanSiaran.find(
      (data) => data.dosen_pa_id === dosenPaId
    );

    console.log(pesanSiaranUser);
    if (!pesanSiaranUser) {
      return true; // Default dianggap belum dibaca jika tidak ditemukan
    }

    const mahasiswa = dataMahasiswa.data.find((data) => data.id === userId);

    // Temukan status pembacaan untuk mahasiswa
    const userStatus = dataStatus
      .filter((data) => data.pesan_siaran_id === pesanSiaranUser.id)
      .find((data) => data.mahasiswa_id === userId);

    // Jika mahasiswa sudah lulus, anggap sudah membaca (return false)
    if (mahasiswa?.status_lulus === true) {
      return false;
    }

    // Jika belum lulus, kembalikan berdasarkan status is_read
    return userStatus ? !userStatus.is_read : true;
  }
);

const pesanSiaranSlice = createSlice({
  name: "pesanSiaran",
  initialState: {
    data: [],
    isPesanSiaranDosenPAUnread: false,
    loading: false,
    error: null,
  },
  reducers: {
    resetState: () => ({
      data: [],
      isPesanSiaranDosenPAUnread: false,
      loading: false,
      error: null,
    }), // Reset state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPesanSiaran.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPesanSiaran.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPesanSiaran.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchStatusPesanSiaran.fulfilled, (state, action) => {
        state.isPesanSiaranDosenPAUnread = action.payload;
      });
  },
});

export const { resetState } = pesanSiaranSlice.actions;

export default pesanSiaranSlice.reducer;
