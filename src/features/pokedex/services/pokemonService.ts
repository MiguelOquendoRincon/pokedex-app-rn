import { fetchJson } from "../api/pokeApi";
import type { PokemonListItem, PokemonListResponse } from "../models/pokemon";

// Extrae el id de la url
function extractIdFromUrl(url: string): number | null {
    const match = url.match(/\/pokemon\/(\d+)\//);
    return match ? Number(match[1]) : null;
}

// Obtiene una página de pokemons
export async function getPokemonPage(params: { limit: number, offset: number; signal?: AbortSignal }) {
    const { limit, offset, signal } = params;

    const data = await fetchJson<PokemonListResponse>(`pokemon?limit=${limit}&offset=${offset}`, { signal });

    // Mapeamos los resultados para obtener solo el id y el nombre
    const items: PokemonListItem[] = data.results.map((item) => ({
        id: extractIdFromUrl(item.url),
        name: item.name,
    })).filter((item) => item.id !== null) as PokemonListItem[];

    // Devolvemos la página
    return {
        count: data.count,
        next: data.next,
        previous: data.previous,
        results: items,
    };
}