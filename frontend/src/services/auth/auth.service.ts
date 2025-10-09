import {
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  RegisterPayload,
  RegisterResponse,
} from '@/models/auth.model';
import { defaultPost } from '@/services/api';
import { useAuthStore } from '@/stores/auth';

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await defaultPost<LoginResponse>('/auth/login', payload, false);
  useAuthStore().saveToken(res.token, { remember: !!payload.rememberMe });
  return res;
}

export async function register(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const auth = useAuthStore();
  if (!auth.getToken) {
    throw new Error('You must be logged in to register a new user.');
  }
  return await defaultPost<RegisterResponse>('/auth/register', payload, true);
}

export async function logout(): Promise<LogoutResponse> {
  const res = await defaultPost<LogoutResponse>('/auth/logout', {}, true);
  useAuthStore().removeToken();
  return res;
}
