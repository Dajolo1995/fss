import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'ffs:hide-balances';

const readStoredValue = (): boolean => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

// Store a nivel de módulo: el modo privacidad es global, así que cualquier
// componente que llame al hook ve el mismo valor y se entera del cambio sin
// necesidad de envolver la app en un provider.
const listeners = new Set<() => void>();
let hideBalances = readStoredValue();

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

const getSnapshot = (): boolean => hideBalances;

export interface UsePrivacyModeReturn { hideBalances: boolean; togglePrivacy: () => void; }

export const usePrivacyMode = (): UsePrivacyModeReturn => {
  const value = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const togglePrivacy = useCallback((): void => {
    hideBalances = !hideBalances;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(hideBalances));
    } catch {
      // Sin localStorage el modo sigue funcionando, solo no sobrevive la recarga.
    }
    listeners.forEach((listener) => listener());
  }, []);
  return { hideBalances: value, togglePrivacy };
};
