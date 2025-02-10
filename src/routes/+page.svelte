<script lang="ts">
  import SearchBar from '$lib/components/SearchBar.svelte';
  import { movieStore } from '$lib/stores/movies';
</script>

<div class="max-w-4xl mx-auto space-y-8">
  <h1 class="text-3xl font-bold text-center">
    Recomendaciones de Películas
  </h1>
  
  <SearchBar />
  
  <div class="space-y-4">
    <h2 class="text-2xl font-semibold">Películas Recomendadas</h2>
    
    {#if $movieStore.length === 0}
      <p class="text-center text-gray-500 py-8">
        Aún no hay películas recomendadas. ¡Sé el primero en añadir una!
      </p>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each $movieStore as movie}
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            {#if movie.poster_path}
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                class="w-full h-64 object-cover"
              />
            {/if}
            <div class="p-4">
              <h3 class="font-semibold text-lg">{movie.title}</h3>
              <p class="text-sm text-gray-500">
                Recomendada el {movie.recommendedAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>