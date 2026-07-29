// Integración con la API de Giphy para las "reacciones GIF" de ChutSocial (ver Dashboard.tsx).
// Falla en silencio si no hay API key configurada o la red/petición fallan -- un post sin GIF
// sigue siendo un post válido, nunca debe romper el feed.
const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY as string | undefined;
const GIPHY_SEARCH_URL = 'https://api.giphy.com/v1/gifs/search';

// Cache en memoria por query: evita repetir la misma búsqueda de red varias veces en la misma
// sesión (el feed se regenera cada vez que cambian semana/rating, y varias tarjetas pueden pedir
// la misma query, ej. "goal celebration").
const gifCache = new Map<string, string | null>();
const gifListCache = new Map<string, string[]>(); // key = `${query}::${offset}`

async function searchGiphy(query: string, limit: number, offset: number): Promise<string[]> {
  if (!GIPHY_API_KEY) return [];
  try {
    const params = new URLSearchParams({
      api_key: GIPHY_API_KEY,
      q: query,
      limit: String(limit),
      offset: String(offset),
      rating: 'pg-13',
      lang: 'es',
    });
    const res = await fetch(`${GIPHY_SEARCH_URL}?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    const results: any[] = data?.data || [];
    return results
      .map(r => r?.images?.fixed_height?.url || r?.images?.original?.url)
      .filter((url: string | undefined): url is string => !!url);
  } catch {
    return [];
  }
}

// Un solo GIF de reacción al azar entre los primeros resultados -- usado para las reacciones
// automáticas del feed (celebración/crítica), donde no hace falta elegir manualmente.
export async function fetchReactionGif(query: string): Promise<string | null> {
  if (!GIPHY_API_KEY) return null;
  if (gifCache.has(query)) return gifCache.get(query)!;

  const results = await searchGiphy(query, 10, 0);
  const pick = results.length > 0 ? results[Math.floor(Math.random() * results.length)] : null;
  gifCache.set(query, pick);
  return pick;
}

// Lista de resultados para que el jugador elija manualmente qué GIF adjuntar a su comentario.
// Paginado: offset 0 trae los primeros 24, offset 24 trae los siguientes 24, etc. -- ver el botón
// "Cargar más" en Dashboard.tsx. Giphy tiene miles de resultados por query típica, el límite real
// de "cuántos GIFs hay" está muy por encima de lo que alguien va a scrollear buscando uno.
const RESULTS_PER_PAGE = 24;
export async function searchReactionGifs(query: string, offset: number = 0): Promise<string[]> {
  if (!GIPHY_API_KEY) return [];
  const cacheKey = `${query}::${offset}`;
  if (gifListCache.has(cacheKey)) return gifListCache.get(cacheKey)!;

  const results = await searchGiphy(query, RESULTS_PER_PAGE, offset);
  gifListCache.set(cacheKey, results);
  return results;
}
