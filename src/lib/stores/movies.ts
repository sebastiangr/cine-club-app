import { writable } from 'svelte/store';
import type { Movie } from '$lib/services/tmdb';

export interface MovieRecommendation extends Movie {
  recommendedAt: Date;
  recommendedBy: string;
  director : string;
  votes: number; // Contador de votos
  hasVoted: boolean; // Indica si el usuario ya ha votado
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
          votes: 0, // Inicializar el contador de votos en cero
          // recommendedBy: 'Usuario', // Placeholder por ahora
        },
        ...movies
      ]);
    },
    removeMovie: (id: number) => { 
      update(movies => movies.filter(movie => movie.id !== id));
    },
    toggleVote: (id: number) => {
      update(movies => {
        const index = movies.findIndex(movie => movie.id === id);
        if (index !== -1) {
          movies[index].hasVoted = !movies[index].hasVoted; // Toggle de votos
          movies[index].votes += movies[index].hasVoted ? 1 : -1; // Incrementar o decrementar seg n sea necesario
        }
        return movies;
      });
    }
  };
}

export const movieStore = createMovieStore();