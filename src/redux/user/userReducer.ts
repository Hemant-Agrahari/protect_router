import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '@/types/user';
import {
  getLocalStorageItem,
  removeFromLocalStorage,
  setLocalStorageItem,
} from '@/utils';

interface UserState {
  user: UserType | null;
  authToken: string | null;
  language: string;
  userBalance: number;
}
const authToken: string = getLocalStorageItem('token') || null;
const language: string = getLocalStorageItem('userSelectedLanguage') || 'en';
const storedUser: string = getLocalStorageItem('auth') || null;

const initialState: UserState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  authToken,
  language,
  userBalance: 0,
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload;
      state.authToken = action.payload?.token || '';

      setLocalStorageItem('auth', action.payload);
      setLocalStorageItem('token', action.payload?.token);
    },
    updateUser: (state, action: PayloadAction<Partial<UserType>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        state.authToken = action.payload?.token || '';
        setLocalStorageItem('auth', state.user);
        setLocalStorageItem('token', action.payload?.token);
      }
    },
    setUserBalance: (state, action: PayloadAction<number>) => {
      state.userBalance = action.payload;
    },
    removeUser: (state) => {
      state.user = null;
      state.authToken = null;
      removeFromLocalStorage('auth');
      removeFromLocalStorage('token');
      removeFromLocalStorage('device_id');
      removeFromLocalStorage('hasClosedPromo');
      removeFromLocalStorage('hasClosedPromo1');
    },
  },
});

export const { setUser, updateUser, removeUser, setUserBalance } =
  authSlice.actions;

export default authSlice.reducer;
