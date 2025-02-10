import { writable } from 'svelte/store';
import type { Movie } from '$lib/services/tmdb';

export interface MovieRecommendation extends Movie {
  recommendedAt: Date;
  recommendedBy: string; // Podríamos usar un ID de usuario real más adelante
}

function createMovieStore() {
  const { subscribe, update } = writable<MovieRecommendation[]>([]);
  
  return {
    subscribe,
    addMovie: (movie: Movie) => {
      update(movies => [
        {
          ...movie,
          recommendedAt: new Date(),
          recommendedBy: 'Usuario', // Placeholder por ahora
        },
        ...movies
      ]);
    }
  };
}

export const movieStore = createMovieStore();