<script>
  import "../app.postcss";
  import { useQueryClient, QueryClientProvider, QueryClient } from '@tanstack/svelte-query';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutos
        refetchOnWindowFocus: false,
      },
    },
  });
  let { children } = $props();
</script>

<main>

  <QueryClientProvider client={queryClient}>
    <main class="container mx-auto px-4 py-8">
      {@render children()}
    </main>
  </QueryClientProvider>
  
</main>