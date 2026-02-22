export type PokemonTypeItem = { name: string };

export type TypeListResponse = {
    results: { name: string; url: string }[];
};

export type TypeDetailResponse = {
    pokemon: { pokemon: { name: string; url: string } }[];
};