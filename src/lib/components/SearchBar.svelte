<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import pkg from 'lodash';
  const { debounce } = pkg;
  import { searchMovies } from '$lib/services/tmdb';
  import { writable } from 'svelte/store';
  import { movieStore } from '$lib/stores/movies'; // Import the movie store
  import { getMovieDetails } from '$lib/services/tmdb'; // Import the new function
  
  let searchTerm = '';
  let error = '';
  const loading = writable(false);
  const searchResults = writable<any[]>([]);
  
  // Creamos la función debounced fuera de la query
  const debouncedSearch = debounce(async (term: string) => {
    error = '';
    if (term.length >= 2) {
      loading.set(true);
      console.log('Searching for:', term);
      
      try {
        const response = await searchMovies(term);
        console.log('Search results:', response);
        searchResults.set(response.results);
      } catch (err) {
        console.error('Search error:', err);
        error = err instanceof Error ? err.message : 'Error en la búsqueda';
        searchResults.set([]);
      } finally {
        loading.set(false);
      }
    } else {
      searchResults.set([]);
    }
  }, 300);

  const query = createQuery({
    queryKey: ['movies', searchTerm],
    queryFn: () => searchMovies(searchTerm),
    enabled: searchTerm.length >= 2 // La query se ejecutará cuando searchTerm tenga 2 o más caracteres
  });

  // Manejador del input
  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    searchTerm = input.value;
    debouncedSearch(input.value);
  }
</script>

<div class="space-y-4">
  <div class="relative">
    <input
      type="text"
      value={searchTerm}
      on:input={handleInput}
      placeholder="Buscar películas..."
      class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    />
    
    {#if $loading}
      <div class="absolute right-3 top-2.5">
        <div class="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    {/if}
  </div>

  {#if error}
    <div class="p-4 bg-red-50 text-red-600 rounded-lg">
      {error}
    </div>
  {/if}
  
  {#if $searchResults.length > 0 && searchTerm.length >= 2}
    <div class="bg-white shadow-lg rounded-lg divide-y">
      {#each $searchResults.slice(0, 5) as movie}
        <button
          class="w-full px-4 py-2 flex items-center gap-4 hover:bg-gray-50 transition"
          on:click={async () => {
            movieStore.addMovie(movie);
            const details = await getMovieDetails(movie.id);
            console.log('Movie details:', details);
          }}
        >
          {#if movie.poster_path}
            <img
              src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
              alt={movie.title}
              class="w-12 h-18 object-cover rounded"
            />
          {:else}
            <div class="w-12 h-18 bg-gray-200 rounded flex items-center justify-center">
              <span class="text-gray-400">Sin imagen</span>
            </div>
          {/if}

          <div class="flex-1 text-left">
            <h3 class="font-medium">{movie.title}</h3>
            <p class="text-sm text-gray-500">
              {new Date(movie.release_date).getFullYear()}
            </p>
            <p class="text-sm text-gray-500">
              Director: {movie.director || 'Desconocido'}
            </p>
            <p class="text-sm text-gray-500">
              Género: {movie.genre || 'Desconocido'}
            </p>
          </div>
        </button>
      {/each}
    </div>
  {:else if searchTerm.length >= 2 && !$loading}
    <p class="text-center text-gray-500 py-4">
      No se encontraron resultados para "{searchTerm}"
    </p>
  {/if}
</div>
