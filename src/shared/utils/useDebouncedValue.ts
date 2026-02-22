import { useEffect, useState } from "react";

// Hook para debouncing. Retorna un valor que se actualiza después de un tiempo determinado
export function useDebouncedValue<T>(value: T, delayMs = 300) {
    const [debounced, setDebounced] = useState<T>(value);

    // Cada vez que cambia el valor, se ejecuta el efecto
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(id);
    }, [value, delayMs]);

    return debounced;
}
