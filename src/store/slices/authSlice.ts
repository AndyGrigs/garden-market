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
    
    // ✅ Neue Action: Login mit Token speichern
    loginSuccess: (state, action: PayloadAction<{user: User, token: string}>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      // Token in Cookies speichern
      Cookies.set('token', action.payload.token, { 
        expires: 7, // 7 Tage
        secure: false, // In Produktion auf true setzen
        sameSite: 'strict'
      });
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // ✅ Cookies löschen
      Cookies.remove('token');
      Cookies.remove('auth_token');
    },
    
    // ✅ Token setzen/updaten
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      Cookies.set('token', action.payload, { expires: 7 });
    }
  },
});

export const { setUser, loginSuccess, logout, setToken } = authSlice.actions;
export default authSlice.reducer;