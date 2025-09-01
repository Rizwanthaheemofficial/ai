
import { useState, useEffect, useCallback } from 'react';

// Custom hook for managing state with localStorage and real-time cross-tab synchronization.
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    // Function to get the initial state from localStorage
    const getStoredValue = useCallback((): T => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    }, [initialValue, key]);

    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(getStoredValue);

    // Function to set the value in state and localStorage
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
                // Dispatch a custom event to notify other tabs
                window.dispatchEvent(new StorageEvent('storage', { key }));
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    // Listen for changes from other tabs
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key) {
                setStoredValue(getStoredValue());
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key, getStoredValue]);

    return [storedValue, setValue];
}

export default useLocalStorage;
