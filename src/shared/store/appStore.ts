import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Definimos el estado de la aplicación
type AppState = {
    theme: "ligth" | "dark";
    setTheme: (theme: AppState["theme"]) => void;
    favoritesIds: Record<number, true>;
    toggleFavorite: (id: number) => void;
    isFavorite: (id: number) => boolean;
    hasHydrated: boolean;
    setHasHydrated: (hasHydrated: boolean) => void;
}

// Creamos el store
export const useAppStore = create<AppState>()(
    persist((set, get) => ({
        theme: "dark",
        setTheme: (theme) => set({ theme }),
        favoritesIds: {},
        toggleFavorite: (id) => set((state) => {
            // Evitamos mutación directa
            const next = { ...state.favoritesIds };
            // Si existe lo eliminamos, si no lo añadimos
            if (next[id]) {
                delete next[id];
            } else {
                next[id] = true;
            }
            return { favoritesIds: next };
        }),
        isFavorite: (id) => get().favoritesIds[id] ?? false,
        hasHydrated: false,
        // Flag para saber si el store se ha cargado desde AsyncStorage
        setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
        {
            name: "pokedex-pro-store",
            // Usamos AsyncStorage para persistir el estado
            storage: createJSONStorage(() => AsyncStorage),
            // Solo guardamos los datos que queremos persistir
            partialize: (state) => ({
                favoritesIds: state.favoritesIds,
                theme: state.theme,
            }),
            // Cuando el store se ha cargado desde AsyncStorage
            onRehydrateStorage(state) {
                state?.setHasHydrated(true);
            },
        }
    )
)