// Integración con la API de Giphy para las "reacciones GIF" de ChutSocial (ver Dashboard.tsx).
// Falla en silencio si no hay API key configurada o la red/petición fallan -- un post sin GIF
// sigue siendo un post válido, nunca debe romper el feed.
const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY as string | undefined;
const GIPHY_SEARCH_URL = 'https://api.giphy.com/v1/gifs/search';

// Cache en memoria por query: evita repetir la misma búsqueda de red varias veces en la misma
// sesión (el feed se regenera cada vez que cambian semana/rating, y varias tarjetas pueden pedir
// la misma query, ej. "goal celebration").
const gifCache = new Map<string, string | null>();
const gifListCache = new Map<string, string[]>();

async function searchGiphy(query: string, limit: number): Promise<string[]> {
  if (!GIPHY_API_KEY) return [];
  try {
    const params = new URLSearchParams({
      api_key: GIPHY_API_KEY,
      q: query,
      limit: String(limit),
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

  const results = await searchGiphy(query, 10);
  const pick = results.length > 0 ? results[Math.floor(Math.random() * results.length)] : null;
  gifCache.set(query, pick);
  return pick;
}

// Lista de resultados para que el jugador elija manualmente qué GIF adjuntar a su comentario.
export async function searchReactionGifs(query: string): Promise<string[]> {
  if (!GIPHY_API_KEY) return [];
  if (gifListCache.has(query)) return gifListCache.get(query)!;

  const results = await searchGiphy(query, 12);
  gifListCache.set(query, results);
  return results;
}
