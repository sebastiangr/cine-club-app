const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  director?: string;
}

export interface SearchResponse {
  results: Movie[];
  total_results: number;
  total_pages: number;
}

export async function getMovieDetails(id: number): Promise<Movie> {
  const url = `${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=es-ES`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error fetching movie details: ${response.statusText}`);
  }

  const movie = await response.json();

  const creditsResponse = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}`);
  if (!creditsResponse.ok) {
    throw new Error(`Error fetching movie credits: ${creditsResponse.statusText}`);
  }

  const credits = await creditsResponse.json();
  movie.director = credits.crew.find((crewMember: { job: string; }) => crewMember.job === 'Director')?.name;

  return movie;
}

export async function searchMovies(query: string): Promise<SearchResponse> {
  if (!query) return { results: [], total_results: 0, total_pages: 0 };

  const url = `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=es-ES`;

  console.log('Fetching:', url.replace(TMDB_API_KEY, 'API_KEY')); // Log seguro de la URL

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Error response:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', {
      totalResults: data.total_results,
      resultsCount: data.results?.length
    });

    return data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}
