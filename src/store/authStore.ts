import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Cek local storage pas pertama load, siapa tau user abis refresh
  token: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),

  login: (token: string) => {
    localStorage.setItem('access_token', token); // Simpan permanen
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('access_token'); // Hapus jejak
    set({ token: null, isAuthenticated: false });
  },
}));