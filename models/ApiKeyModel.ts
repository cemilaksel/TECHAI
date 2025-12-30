
const STORAGE_KEY = 'gemini_api_key';

export interface ApiKeyState {
  key: string | null;
  isValid: boolean;
}

export function getApiKey(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key);
}

export function removeApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasApiKey(): boolean {
  const key = getApiKey();
  return key !== null && key.length > 10;
}
