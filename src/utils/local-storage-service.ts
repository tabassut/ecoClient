export function getFromLocalStorage(key: string) {
  const value = localStorage.getItem(key);

  return value ? JSON.parse(value) : null;
}

export function setInLocalStorage(key: string, value: any) {
  return localStorage.setItem(key, JSON.stringify(value));
}

export function removeFromLocalStorage(key: string) {
  return localStorage.removeItem(key);
}

export const STORAGE_KEY = {
  ACCESS_TOKEN: "token",
  SEARCH: "search",
};
