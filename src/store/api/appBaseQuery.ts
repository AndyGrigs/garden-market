// src/store/api/appBaseQuery.ts - FIX für FormData
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { BASE_URL } from '../../config';
import type { RootState } from '../store';
import Cookies from 'js-cookie';

export const appBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // 1. Token aus Redux State oder Cookies
    const state = getState() as RootState;
    const token = state.auth.token;
    const cookieToken = Cookies.get('token') || Cookies.get('auth_token');
    
    // 2. Authorization Header setzen
    const authToken = token || cookieToken;
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }
    
    // 3. ✅ FIX: Content-Type nur für JSON, NICHT für FormData
    // FormData setzt automatisch multipart/form-data mit boundary
    // Wenn wir Content-Type manuell setzen, überschreiben wir das boundary!
    
    // Prüfe ob der Request Body FormData ist
    // Das ist ein Workaround, da wir hier keinen direkten Zugriff auf body haben
    // Alternativ: Lass Content-Type einfach weg, Browser setzt es automatisch
    
    return headers;
  },
});

// Alternative Lösung: Separater Query für FormData
export const formDataBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token || Cookies.get('token') || Cookies.get('auth_token');
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // ✅ WICHTIG: Kein Content-Type für FormData setzen!
    // Browser setzt automatisch multipart/form-data mit korrektem boundary
    
    return headers;
  },
});