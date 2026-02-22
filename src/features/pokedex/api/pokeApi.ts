const BASE_URL = "https://pokeapi.co/api/v2/";

// Definimos la clase ApiError que hereda de Error
export class ApiError extends Error {
    // Sobrecargamos el constructor para que pueda recibir 2 o 3 parámetros
    constructor(message: string, public status: number, public url?: string) {
        super(message);
        this.name = "ApiError";
    }
}

// Definimos el tipo FetchJsonOptions que hereda de RequestInit y tiene un parámetro opcional signal de tipo AbortSignal
type FetchJsonOptions = RequestInit & {
    signal?: AbortSignal;
}

// Definimos la función fetchJson que recibe un path y un objeto de opciones y devuelve una promesa de T
export async function fetchJson<T>(path: string, options?: FetchJsonOptions) {
    const url = `${BASE_URL}${path}`;
    let res: Response;
    try {
        // Realizamos la petición
        res = await fetch(url, {
            ...options, headers: {
                Accept: "application/json",
                ...(options?.headers ?? {}),
            }
        });

    } catch (error) {
        throw new ApiError("Error al obtener los datos", 500, url);
    }

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new ApiError(`Request failed (${res.status}) ${text ? `- ${text}` : ""}`.trim(), res.status, url);
    }

    // Devolvemos el resultado
    return await res.json() as T;
}