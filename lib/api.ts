const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || 'https://app.scg.io';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_DOMAIN}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 204) {
      return {} as T;
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
