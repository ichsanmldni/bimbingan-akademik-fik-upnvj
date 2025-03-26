import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Thunk untuk mengambil data bab
export const fetchDataBab = createAsyncThunk(
  "dataBab/fetchDataBab",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/api/databab`);
    if (response.status !== 200) throw new Error("Gagal mengambil data");
    return response.data.sort((a, b) => a.order - b.order);
  }
);

// Thunk untuk mengambil subbab berdasarkan Bab yang dipilih
export const fetchDataSubBabByBab = createAsyncThunk(
  "dataBab/fetchDataSubBabByBab",
  async (selectedBab: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/databab`);
      const bab = response.data.find((data) => data.nama === selectedBab);

      if (!bab) return rejectWithValue("Bab tidak ditemukan");

      const subBabResponse = await axios.get(
        `${API_BASE_URL}/api/datasubbab/${bab.id}`
      );
      if (subBabResponse.status !== 200)
        throw new Error("Gagal mengambil data");

      return subBabResponse.data.sort((a, b) => a.order - b.order);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk untuk mengambil data subbab berdasarkan nama subbab
export const fetchDataSubBabByNama = createAsyncThunk(
  "dataBab/fetchDataSubBabByNama",
  async (
    {
      selectedBab,
      selectedSubBab,
    }: { selectedBab: string; selectedSubBab: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/databab`);
      const bab = response.data.find((data) => data.nama === selectedBab);

      if (!bab) return rejectWithValue("Bab tidak ditemukan");

      const subBabResponse = await axios.get(
        `${API_BASE_URL}/api/datasubbab/${bab.id}`
      );
      const subbab = subBabResponse.data.find(
        (data) => data.nama === selectedSubBab
      );

      return subbab || null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchDataBabByNama = createAsyncThunk(
  "dataBab/fetchDataBabByNama",
  async ({ selectedBab }: { selectedBab: string }, { rejectWithValue }) => {
    try {
      console.log(selectedBab);
      const response = await axios.get(`${API_BASE_URL}/api/databab`);
      const bab = response.data.find((data) => data.nama === selectedBab);

      if (!bab) return rejectWithValue("Bab tidak ditemukan");

      return bab || null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const dataBabSlice = createSlice({
  name: "bab",
  initialState: {
    dataBab: [],
    dataSubBab: [],
    selectedBab: null,
    selectedSubBab: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetState: () => ({
      dataBab: [],
      dataSubBab: [],
      selectedBab: null,
      selectedSubBab: null,
      loading: false,
      error: null,
    }), // Reset state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataBab.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataBab.fulfilled, (state, action) => {
        state.loading = false;
        state.dataBab = action.payload;
        if (action.payload.length > 0) {
          const firstBab = action.payload[0];
          state.selectedBab = firstBab;
        }
      })
      .addCase(fetchDataBab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDataBabByNama.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataBabByNama.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBab = action.payload;
      })
      .addCase(fetchDataBabByNama.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDataSubBabByBab.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataSubBabByBab.fulfilled, (state, action) => {
        state.loading = false;
        state.dataSubBab = action.payload;
        if (action.payload.length > 0) {
          state.selectedSubBab = action.payload[0];
        }
      })
      .addCase(fetchDataSubBabByBab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDataSubBabByNama.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataSubBabByNama.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubBab = action.payload;
      })
      .addCase(fetchDataSubBabByNama.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = dataBabSlice.actions;
export default dataBabSlice.reducer;
