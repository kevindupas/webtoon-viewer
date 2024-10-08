import { useState, Dispatch, SetStateAction } from 'react';

type HookReturnType<T> = [T, Dispatch<SetStateAction<T>>];

const useLocalStorage = <T>(
    key: string,
    initialValue: T
): HookReturnType<T> => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue: HookReturnType<T>[1] = (value) => {
        try {
            const valueToStore =
        value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

export default useLocalStorage;
