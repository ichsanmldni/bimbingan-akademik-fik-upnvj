import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedSubMenuState {
  value: string | null;
}

const initialState: SelectedSubMenuState = {
  value: null,
};

const selectedSubMenuSlice = createSlice({
  name: "selectedSubMenu",
  initialState,
  reducers: {
    setSelectedSubMenu: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    clearSelectedSubMenu: (state) => {
      state.value = null;
    },
    resetState: () => initialState, // Reset state
  },
});

export const { setSelectedSubMenu, clearSelectedSubMenu, resetState } =
  selectedSubMenuSlice.actions;
export default selectedSubMenuSlice.reducer;
