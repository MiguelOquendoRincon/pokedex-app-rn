import { create } from "zustand";

// Definimos el estado de la aplicación
type AppState = {
    theme: "ligth" | "dark";
    setTheme: (theme: AppState["theme"]) => void;
}

// Creamos el store
export const useAppStore = create<AppState>((set) => ({
    theme: "ligth",
    setTheme: (theme) => set({ theme }),
}))