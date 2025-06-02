import {
  FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE
} from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';
import { persistedReducer } from './persistConfig';

// Configure Redux store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore serialization warnings for these redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
      // serializableCheck: false
    })
});

// Persistor to persist and rehydrate the store
export const persistor = persistStore(store);

// Export root state type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;