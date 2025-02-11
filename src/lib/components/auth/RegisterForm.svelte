<script lang="ts">
  import { auth } from '$lib/stores/auth';
  
  let email = '';
  let password = '';
  let name = '';
  let error = '';
  let loading = false;

  async function handleSubmit() {
    loading = true;
    error = '';

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrarse');
      }

      // Guardar token en localStorage
      localStorage.setItem('token', data.token);
      
      // Actualizar store de autenticación
      auth.setUser(data.user);
      auth.setToken(data.token);

    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al registrarse';
    } finally {
      loading = false;
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
  <div>
    <label for="name" class="block text-sm font-medium text-gray-700">
      Nombre
    </label>
    <input
      type="text"
      id="name"
      bind:value={name}
      required
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
  </div>

  <div>
    <label for="email" class="block text-sm font-medium text-gray-700">
      Correo electrónico
    </label>
    <input
      type="email"
      id="email"
      bind:value={email}
      required
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
  </div>

  <div>
    <label for="password" class="block text-sm font-medium text-gray-700">
      Contraseña
    </label>
    <input
      type="password"
      id="password"
      bind:value={password}
      required
      minlength="6"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
  </div>

  {#if error}
    <div class="text-red-600 text-sm">{error}</div>
  {/if}

  <button
    type="submit"
    disabled={loading}
    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
  >
    {#if loading}
      <span class="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></span>
    {:else}
      Registrarse
    {/if}
  </button>
</form>