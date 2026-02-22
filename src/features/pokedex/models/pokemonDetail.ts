export type PokemonType = { name: string };
export type PokemonStat = { name: string, value: number };

export type PokemonDetail = {
    id: number;
    name: string;
    artworkUrl: string | null;
    types: PokemonType[];
    stats: PokemonStat[];
    height: number;
    weight: number;
    abilities: string[];
}