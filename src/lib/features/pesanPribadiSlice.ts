import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Ganti dengan base URL yang benar

export const fetchPesanPribadi = createAsyncThunk(
  "chat/fetchPesanPribadi",
  async ({ roleUser, userId }: { userId: number; roleUser: string }) => {
    const [pesanRes, mahasiswaRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/api/chatpribadi`),
      axios.get(`${API_BASE_URL}/api/datamahasiswa`),
    ]);

    const pesanData = pesanRes.data;
    const mahasiswaData = mahasiswaRes.data;

    if (roleUser === "Dosen PA") {
      // Ambil pesan untuk dosen PA
      const pesanDosenPA = pesanData.filter(
        (data) => data.dosen_pa_id === userId
      );

      // Filter mahasiswa yang belum lulus
      const pesanTanpaMahasiswaLulus = pesanDosenPA.filter((pesan) => {
        const mahasiswa = mahasiswaData.find(
          (m) => m.id === pesan.mahasiswa_id
        );
        return mahasiswa?.status_lulus === false; // hanya yang belum lulus
      });

      return pesanTanpaMahasiswaLulus;
    } else if (roleUser === "Mahasiswa") {
      const filtered = pesanData.filter((data) => data.mahasiswa_id === userId);

      const mhs = mahasiswaData.find((m) => m.id === userId);
      const status_lulus = mhs?.status_lulus ?? false;

      // Tambahkan status_lulus ke masing-masing item agar bisa dipakai di reducer
      return filtered.map((item) => ({
        ...item,
        status_lulus,
      }));
    }

    return [];
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
        console.log("ini dari redux", state, action);

        if (action.payload.length > 0) {
          const pesanPribadiUser = action.payload.find(
            (data) => data.mahasiswa_id
          );

          const mahasiswaLulus = pesanPribadiUser?.status_lulus === true;

          state.isPesanPribadiDosenPAUnread = mahasiswaLulus
            ? false
            : !pesanPribadiUser?.is_mahasiswa_pesan_terakhir_read;

          const isDosenPAReadAll = action.payload.every(
            (data) => data.is_dosenpa_pesan_terakhir_read === true
          );
          state.isPesanPribadiMahasiswaUnread = !isDosenPAReadAll;
        } else {
          state.isPesanPribadiDosenPAUnread = false;
          state.isPesanPribadiMahasiswaUnread = false;
        }
      })

      .addCase(fetchPesanPribadi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetState } = pesanPribadiSlice.actions;
export default pesanPribadiSlice.reducer;
