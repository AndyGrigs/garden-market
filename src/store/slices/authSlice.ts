// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/IUser';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: Cookies.get('token') || Cookies.get('auth_token') || null, // ✅ Token aus Cookies laden
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
    },
    
  },
});

export const { setUser, logout} = authSlice.actions;
export default authSlice.reducer;