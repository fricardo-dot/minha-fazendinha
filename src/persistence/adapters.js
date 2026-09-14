// Adapters de armazenamento. localStorage quando disponível; memória como fallback
// (modo privado no iOS pode lançar ao acessar localStorage).

export function memoryAdapter() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, v); },
    removeItem: (k) => { map.delete(k); },
  };
}

export function localStorageAdapter() {
  try {
    const probe = '__fz_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

export function pickAdapter() {
  return localStorageAdapter() || memoryAdapter();
}
