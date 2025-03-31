import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import UserType from '@/types/user'

interface UserState {
  user: UserType | null
  isAuthenticated: boolean
  isLoginModal: boolean
  userBalance: number
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoginModal: false,
  userBalance: 0,
}

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      localStorage.setItem('auth', JSON.stringify(action.payload))
    },
    updateUser: (state, action: PayloadAction<Partial<UserType>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('auth', JSON.stringify(state.user))
      }
    },
    setUserBalance: (state, action: PayloadAction<number>) => {
      state.userBalance = action.payload
    },
    removeUser: (state) => {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('auth')
      localStorage.removeItem('device_id')
      localStorage.removeItem('hasClosedPromo')
      localStorage.removeItem('hasClosedPromo1')
    },
  },
})

export const { setUser, updateUser, removeUser, setUserBalance } =
  authSlice.actions

export default authSlice.reducer
