import { defineStore } from 'pinia';

type AuthState = {
  token: string | null;
};

const STORAGE_KEY = 'auth.token';
const STORAGE_TYPE_KEY = 'auth.token.storage';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getToken: (state) => state.token,
  },

  actions: {
    saveToken(token: string, opts?: { remember?: boolean }) {
      this.token = token;
      const remember = opts?.remember ?? false;

      const target = remember ? localStorage : sessionStorage;
      const other = remember ? sessionStorage : localStorage;

      target.setItem(STORAGE_KEY, token);
      localStorage.setItem(STORAGE_TYPE_KEY, remember ? 'local' : 'session');
      other.removeItem(STORAGE_KEY);
    },

    removeToken() {
      this.token = null;
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TYPE_KEY);
    },

    hydrateFromStorage() {
      const type = localStorage.getItem(STORAGE_TYPE_KEY);
      const storage = type === 'local' ? localStorage : sessionStorage;
      const token = storage.getItem(STORAGE_KEY);
      this.token = token;
    },
  },
});
