 export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'user' | 'admin';
    language?: string;
  }