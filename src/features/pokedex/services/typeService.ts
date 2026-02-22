import { fetchJson } from "../api/pokeApi";
import type { PokemonListItem } from "../models/pokemon";
import type { PokemonTypeItem, TypeDetailResponse, TypeListResponse } from "../models/types";

// Función auxiliar para extraer el ID de la URL del pokemon
function extractIdFromUrl(url: string): number {
    const match = url.match(/\/pokemon\/(\d+)\//);
    return match ? Number(match[1]) : NaN;
}

// Obtiene la lista de tipos
export async function getTypes(params?: { signal?: AbortSignal }): Promise<PokemonTypeItem[]> {
    const data = await fetchJson<TypeListResponse>(`/type`, { signal: params?.signal });
    // filtramos los “weird” types si quieres luego; por ahora dejamos todos
    return data.results.map((t) => ({ name: t.name }));
}

// Obtiene los pokemons de un tipo específico
export async function getPokemonByType(params: { typeName: string; signal?: AbortSignal }) {
    const data = await fetchJson<TypeDetailResponse>(`/type/${params.typeName}`, { signal: params.signal });

    const items: PokemonListItem[] = data.pokemon
        .map((p) => ({
            id: extractIdFromUrl(p.pokemon.url),
            name: p.pokemon.name,
        }))
        .filter((x) => Number.isFinite(x.id));

    // Orden por id para UX
    items.sort((a, b) => a.id - b.id);

    return items;
}