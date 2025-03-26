import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";

// Import reducers
import mahasiswaReducer from "./features/mahasiswaSlice";
import dosenPAReducer from "./features/dosenPASlice";
import kaprodiReducer from "./features/kaprodiSlice";
import userReducer from "./features/userSlice";
import authReducer from "./features/authSlice";
import notificationReducer from "./features/notificationSlice";
import pesanPribadiReducer from "./features/pesanPribadiSlice";
import pesanSiaranReducer from "./features/pesanSiaranSlice";
import dataBabReducer from "./features/babSlice";
import selectedSubMenuReducer from "./features/selectedSubMenuSlice";

// Konfigurasi Persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "user",
    "notifikasi",
    "mahasiswa",
    "dosenPA",
    "kaprodi",
    "pesanPribadi",
    "pesanSiaran",
    "dataBab",
    "selectedSubMenu",
  ], // Tentukan state mana yang ingin disimpan
};

// Gabungkan semua reducer
const rootReducer = combineReducers({
  mahasiswa: mahasiswaReducer,
  dosenPA: dosenPAReducer,
  kaprodi: kaprodiReducer,
  user: userReducer,
  auth: authReducer,
  notifikasi: notificationReducer,
  pesanPribadi: pesanPribadiReducer,
  pesanSiaran: pesanSiaranReducer,
  bab: dataBabReducer,
  selectedSubMenu: selectedSubMenuReducer,
});

// Bungkus rootReducer dengan persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Fungsi untuk membuat store
export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(thunk),
  });

  return store;
};

// Buat store tunggal agar tidak reset
export const store = makeStore();
export const persistor = persistStore(store);

// Types untuk Redux
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
