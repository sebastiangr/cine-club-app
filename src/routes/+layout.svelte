<script>
  import "../app.postcss";
  import { useQueryClient, QueryClientProvider, QueryClient } from '@tanstack/svelte-query';
  import { auth } from '$lib/stores/auth';
  import { onMount } from 'svelte';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutos
        refetchOnWindowFocus: false,
      },
    },
  });
  let { children } = $props();

  // Verificar token al cargar
  onMount(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Aquí podrías hacer una llamada a la API para validar el token
      // y obtener los datos del usuario
      // Por ahora solo actualizamos el store con el token
      auth.setToken(token);
    }
  });

  function handleLogout() {
    localStorage.removeItem('token');
    auth.logout();
  }

</script>

<QueryClientProvider client={queryClient}>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <a href="/" class="flex-shrink-0 flex items-center">
              Recomendaciones de Películas
            </a>
          </div>
          
          <div class="flex items-center">
            {#if $auth.user}
              <span class="text-gray-700 mr-4">
                {$auth.user.name || $auth.user.email}
              </span>
              <button
                on:click={handleLogout}
                class="text-gray-700 hover:text-gray-900"
              >
                Cerrar sesión
              </button>
            {:else}
              
              <a href="/auth"
                class="text-gray-700 hover:text-gray-900"
              >
                Iniciar sesión
              </a>
            {/if}
          </div>
        </div>
      </div>
    </nav>

    <main class="container mx-auto px-4 py-8">
      {@render children()}
    </main>
  </div>
</QueryClientProvider>

  <!-- <QueryClientProvider client={queryClient}>
    <main class="container mx-auto px-4 py-8">
      {@render children()}
    </main>
  </QueryClientProvider> -->
  
