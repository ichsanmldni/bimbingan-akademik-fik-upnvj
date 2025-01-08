import { configureStore } from '@reduxjs/toolkit';
import selectedSubMenuReducer from './selectedSubMenuSlice';

const store = configureStore({
    reducer: {
        selectedSubMenu: selectedSubMenuReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;  
