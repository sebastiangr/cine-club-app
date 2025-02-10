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
    addMovie: (movie: MovieRecommendation) => {
      update(movies => [
        {
          ...movie,
          recommendedAt: new Date(),
          recommendedBy: movie.recommendedBy, 
          director: movie.director, // Asegurarse de que el director se incluya
          // recommendedBy: 'Usuario', // Placeholder por ahora
        },
        ...movies
      ]);
    },
    removeMovie: (id: number) => {
      update(movies => movies.filter(movie => movie.id !== id));
    }
  };
}

export const movieStore = createMovieStore();
