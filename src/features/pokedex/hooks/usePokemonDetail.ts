import { useQuery } from "@tanstack/react-query";
import { getPokemonDetail } from "../services/pokemonDetailService";

// Key para la query del detalle del pokemon
export const pokemonDetailKey = (id: string) => ["pokemon", "detail", id] as const;

// Hook para obtener el detalle de un pokemon
export const usePokemonDetail = (id: string) => {
    return useQuery({
        queryKey: pokemonDetailKey(id),
        queryFn: async ({ signal }) => getPokemonDetail({ id, signal }),
    });
}
