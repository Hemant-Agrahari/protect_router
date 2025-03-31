import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userReducer'
import gamesReducer from './games/gamesReducer'

export const store = configureStore({
  reducer: {
    user: userReducer,
    games: gamesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
