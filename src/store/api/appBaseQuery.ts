// import { fetchBaseQuery } from '@reduxjs/toolkit/query';

// export const appBaseQuery =  fetchBaseQuery({
//          baseUrl: "http://localhost:4444",
//      //     baseUrl: "https://garden-market-backend.onrender.com",
//          credentials: 'include'
//     })


import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { BASE_URL } from '../../config';

export const appBaseQuery =  fetchBaseQuery({
  baseUrl: BASE_URL,
}
)