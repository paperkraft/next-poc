import { persistReducer } from 'redux-persist';
import { encryptedStorage } from '@/lib/encrypt-decrypt';
import { rootReducer } from './reducer';

export const persistConfig = {
    key: 'root',
    storage: encryptedStorage,
    whitelist: ['stepperForm']
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);