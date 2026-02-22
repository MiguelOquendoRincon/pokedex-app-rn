import { useQuery } from "@tanstack/react-query";
import { getPokemonByType, getTypes } from "../services/typeService";

// Hook para obtener la lista de tipos
export function useTypes() {
    return useQuery({
        queryKey: ["pokemon", "types"],
        queryFn: ({ signal }) => getTypes({ signal }),
        staleTime: 1000 * 60 * 60, // 1h
    });
}

// Hook para obtener los pokemons de un tipo específico
export function usePokemonByType(typeName: string | null) {
    return useQuery({
        queryKey: ["pokemon", "list", "byType", typeName],
        enabled: Boolean(typeName),
        queryFn: ({ signal }) => getPokemonByType({ typeName: typeName!, signal }),
        staleTime: 1000 * 60 * 10,
    });
}