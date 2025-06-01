'use client'
import { persistor, store } from '@/redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

/**
 * StoreProvider component
 * 
 * This component provides the Redux store to the entire application,
 * ensuring that state management is available across all components.
 * 
 * @param {React.ReactNode} children - Child components that need access to the Redux store.
 */
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>
}