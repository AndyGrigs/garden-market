import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/IUser';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Load initial state from cookies
const loadUserFromCookies = (): User | null => {
  try {
    const userData = Cookies.get('user');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: loadUserFromCookies(),
  isAuthenticated: !!loadUserFromCookies(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<User>
    ) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Save user to cookies for persistence
      Cookies.set('user', JSON.stringify(action.payload), { 
        expires: 7, // 7 days
        secure: true,
        sameSite: 'strict'
      });
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Remove user from cookies
      Cookies.remove('user');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;