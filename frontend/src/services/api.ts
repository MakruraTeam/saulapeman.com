import { ApiError } from '@/models/api.model';
import { useAuthStore } from '@/stores/auth';

const BACKEND_URL = 'http://localhost:3001/api';

async function request<T = unknown>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  endpoint: string,
  body?: Record<string, unknown>,
  auth = false
): Promise<T> {
  const url = `${BACKEND_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = useAuthStore().getToken;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = res.status === 204 ? undefined : await res.json();

  if (!res.ok) {
    if (auth && (res.status === 401 || res.status === 403)) {
      try {
        useAuthStore().removeToken();
      } catch {}
    }
    const message =
      (data &&
        typeof data === 'object' &&
        'error' in (data as any) &&
        (data as any).error) ||
      res.statusText ||
      'Request failed';
    throw new ApiError(String(message), res.status, data);
  }

  return data as T;
}

export const defaultGet = async <T = unknown>(endpoint: string, auth = false) =>
  request<T>('GET', endpoint, undefined, auth);

export const defaultPost = async <T = unknown>(
  endpoint: string,
  data: Record<string, unknown>,
  auth = false
) => request<T>('POST', endpoint, data, auth);

export const defaultPatch = async <T = unknown>(
  endpoint: string,
  data: Record<string, unknown>,
  auth = false
) => request<T>('PATCH', endpoint, data, auth);

export const defaultDelete = async <T = unknown>(
  endpoint: string,
  auth = false
) => request<T>('DELETE', endpoint, undefined, auth);
