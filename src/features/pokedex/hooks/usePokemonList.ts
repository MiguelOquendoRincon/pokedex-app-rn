import { useInfiniteQuery } from "@tanstack/react-query";
import { getPokemonPage } from "../services/pokemonService";

// Tamaño de la página
const PAGE_SIZE = 20;

// Hook para obtener una lista infinita de pokemons
export const usePokemonList = () => {
    return useInfiniteQuery({
        queryKey: ["pokemon", "list", { pageSize: PAGE_SIZE }],
        initialPageParam: 0, // offset
        queryFn: async ({ pageParam, signal }) => getPokemonPage({ limit: PAGE_SIZE, offset: pageParam as number, signal }),
        // Función para obtener el parámetro de la siguiente página
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.next) return undefined;
            return allPages.length * PAGE_SIZE; // offset para la siguiente página
        },
    });
}