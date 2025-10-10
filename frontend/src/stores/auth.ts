import { defineStore } from 'pinia';

type AuthState = {
  token: string | null;
  username: string | null;
};

const STORAGE_KEY = 'auth.token';
const STORAGE_TYPE_KEY = 'auth.token.storage';

function decodeJwt<T = any>(token: string): T | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    username: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getToken: (state) => state.token,
    getUsername: (state) => state.username,
  },

  actions: {
    saveToken(token: string, opts?: { remember?: boolean }) {
      this.token = token;

      const decoded = decodeJwt<{ username?: string }>(token);
      this.username = decoded?.username ?? null;

      const remember = opts?.remember ?? false;
      const target = remember ? localStorage : sessionStorage;
      const other = remember ? sessionStorage : localStorage;

      target.setItem(STORAGE_KEY, token);
      localStorage.setItem(STORAGE_TYPE_KEY, remember ? 'local' : 'session');
      other.removeItem(STORAGE_KEY);
    },

    removeToken() {
      this.token = null;
      this.username = null;
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TYPE_KEY);
    },

    hydrateFromStorage() {
      const type = localStorage.getItem(STORAGE_TYPE_KEY);
      const storage = type === 'local' ? localStorage : sessionStorage;
      const token = storage.getItem(STORAGE_KEY);
      this.token = token;

      this.username = token
        ? decodeJwt<{ username?: string }>(token)?.username ?? null
        : null;
    },
  },
});
