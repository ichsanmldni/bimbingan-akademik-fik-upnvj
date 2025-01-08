import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedSubMenuState {
    value: string;
}

const initialState: SelectedSubMenuState = {
    value: '',
};

const selectedSubMenuSlice = createSlice({
    name: 'selectedSubMenu',
    initialState,
    reducers: {
        setSelectedSubMenu: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        },
    },
});

export const { setSelectedSubMenu } = selectedSubMenuSlice.actions;
export default selectedSubMenuSlice.reducer;  
