const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('shaukat_token');
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem('shaukat_token', token);
  } else {
    localStorage.removeItem('shaukat_token');
  }
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}
