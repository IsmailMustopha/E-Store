import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import createWebStorage from "redux-persist/lib/storage/createWebStorage"; // Change this import
import authReducer from "./reducer/authReducer";
import cartReducer from "./reducer/cartReducer";

// 1. Create a dummy storage for the server-side
const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

// 2. Select storage based on environment (Browser vs Server)
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const rootReducer = combineReducers({
  authStore: authReducer,
  cartStore: cartReducer,
});

const persistConfig = {
  key: "root",
  storage, // Use the conditional storage here
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import persistReducer from "redux-persist/es/persistReducer";
// import persistStore from "redux-persist/es/persistStore";
// import localStorage from "redux-persist/es/storage";
// import authReducer from "./reducer/authReducer";
// import cartReducer from "./reducer/cartReducer";

// const rootReducer = combineReducers({
//   authStore: authReducer,
//   cartStore: cartReducer
// });

// const persistConfig = {
//   key: "root",
//   storage: localStorage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({ serializableCheck: false }),
// });

// export const persistor = persistStore(store);
