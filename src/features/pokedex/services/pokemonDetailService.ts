import { fetchJson } from "../api/pokeApi";
import { PokemonDetail } from "../models/pokemonDetail";

// Estructura de la respuesta de la API
type PokemonDetailApi = {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: { type: { name: string } }[];
    stats: { base_stat: number, stat: { name: string } }[];
    abilities: { ability: { name: string } }[];
    sprites: {
        other?: {
            "official-artwork"?: {
                front_default: string | null;
            }
        }
    }
}


// Obtiene el detalle de un pokemon
export const getPokemonDetail = async (params: {
    id: string;
    signal?: AbortSignal;
}): Promise<PokemonDetail> => {
    const { id, signal } = params;
    const data = await fetchJson<PokemonDetailApi>(`pokemon/${id}`, { signal });
    // Obtenemos la url de la imagen del pokemon
    const artworkUrl = data.sprites?.other?.["official-artwork"]?.front_default ?? null;
    // Obtenemos los tipos del pokemon
    const types = data.types.map((t: any) => ({ name: t.type.name }));
    // Obtenemos las estadísticas del pokemon
    const stats = data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat }));
    // Obtenemos las habilidades del pokemon
    const abilities = data.abilities.map((a: any) => a.ability.name);

    // Devolvemos el detalle del pokemon
    return {
        id: data.id,
        name: data.name,
        artworkUrl,
        types,
        stats,
        height: data.height,
        weight: data.weight,
        abilities,
    };

}