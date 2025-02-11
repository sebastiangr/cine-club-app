import { writable } from 'svelte/store';
import { getMovieDetails } from '$lib/services/tmdb'; // Import the function to get movie details
import { authStore } from '$lib/stores/auth'; // Import the auth store

const movieStore = writable<any[]>([]);

const addMovie = (movie: any) => {
    authStore.subscribe(auth => {
      if (!auth.isAuthenticated) {
          throw new Error('User must be logged in to add a movie.');
      }
      movieStore.update((movies) => {
          return [...movies, movie];
      });
  });
};

const removeMovie = (id: string) => {
  authStore.subscribe(auth => {
    if (!auth.isAuthenticated) {
        throw new Error('User must be logged in to remove a movie.');
    }
    movieStore.update((movies) => {
        return movies.filter(movie => movie.id !== id);
    });
  });
};

const toggleVote = (id: string) => {
  authStore.subscribe(auth => {
    if (!auth.isAuthenticated) {
        throw new Error('User must be logged in to vote.');
    }
    movieStore.update((movies) => {
        return movies.map(movie => {
            if (movie.id === id) {
                return { ...movie, hasVoted: !movie.hasVoted };
            }
            return movie;
        });
    });
  });
};

// Fetch movie details from TMDB
const fetchMovieDetails = async (movieId: number) => {
    const details = await getMovieDetails(movieId);
    return details;
};

// Fetch recommendations from the database
const fetchRecommendationsFromDB = async () => {
    const response = await fetch('/api/movies/recommendations');
    if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
    }
    const recommendations = await response.json();
    return recommendations;
};

// Load recommendations and fetch details from TMDB
const loadRecommendations = async () => {
    const recommendations = await fetchRecommendationsFromDB();
    const detailedRecommendations = await Promise.all(recommendations.map(async (rec: { movieId: number; userId: string; }) => {
        const details = await fetchMovieDetails(rec.movieId);
        return {
            ...rec,
            title: details.title,
            posterPath: details.poster_path,
            recommendedBy: rec.userId, // Assuming userId is the recommender's ID
        };
    }));
    movieStore.set(detailedRecommendations);
};

// Export the store and its methods
export const movieStoreMethods = {
    subscribe: movieStore.subscribe,
    addMovie,
    removeMovie,
    toggleVote,
    loadRecommendations,
};