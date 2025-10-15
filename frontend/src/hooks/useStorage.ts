'use client';

import { useEffect, useState } from 'react';

export type StorageType = 'localStorage' | 'sessionStorage' | 'cookie';

interface UseStorageOptions {
  defaultValue?: string;
  serialize?: (value: any) => string;
  deserialize?: (value: string) => object;
  storageType?: StorageType;
}

/**
 * Hook that syncs state with browser storage (localStorage, sessionStorage, or cookies)
 * Falls back gracefully when storage is not available (SSR)
 */
export function useStorage(key: string, options: UseStorageOptions = {}) {
  const {
    defaultValue = '',
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    storageType = 'localStorage',
  } = options;

  // State to track if we're hydrated
  const [isHydrated, setIsHydrated] = useState(false);
  const [storedValue, setStoredValue] = useState(defaultValue);

  useEffect(() => {
    try {
      let item: string | null = null;

      if (storageType === 'cookie') {
        // Parse cookies
        const cookies = document.cookie.split(';').reduce(
          (acc, cookie) => {
            const [name, value] = cookie.trim().split('=');
            acc[name] = value ? decodeURIComponent(value) : '';
            return acc;
          },
          {} as Record<string, string>
        );
        item = cookies[key] || null;
      } else {
        // Use localStorage or sessionStorage
        const storage =
          storageType === 'localStorage' ? localStorage : sessionStorage;
        item = storage.getItem(key);
      }

      if (item) {
        setStoredValue(typeof item === 'string' ? item : deserialize(item));
      }
    } catch (error) {
      console.warn(`Error reading from ${storageType}:`, error);
    }

    setIsHydrated(true);
  }, [key, storageType, deserialize]);

  const setValue = (value: any) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (storageType === 'cookie') {
        // Set cookie with 1 year expiration
        const expires = new Date();
        expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
        document.cookie = `${key}=${encodeURIComponent(
          typeof valueToStore === 'string'
            ? valueToStore
            : serialize(valueToStore)
        )};expires=${expires.toUTCString()};path=/`;
      } else {
        const storage =
          storageType === 'localStorage' ? localStorage : sessionStorage;
        storage.setItem(
          key,
          typeof valueToStore === 'string'
            ? valueToStore
            : serialize(valueToStore)
        );
      }
    } catch (error) {
      console.warn(`Error writing to ${storageType}:`, error);
    }
  };

  const removeValue = () => {
    try {
      if (storageType === 'cookie') {
        document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      } else {
        const storage =
          storageType === 'localStorage' ? localStorage : sessionStorage;
        storage.removeItem(key);
      }
      setStoredValue(defaultValue);
    } catch (error) {
      console.warn(`Error removing from ${storageType}:`, error);
    }
  };

  return [storedValue, setValue, removeValue, isHydrated] as const;
}
