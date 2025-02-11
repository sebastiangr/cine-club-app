<script lang="ts">
  import LoginForm from '$lib/components/auth/LoginForm.svelte';
  import RegisterForm from '$lib/components/auth/RegisterForm.svelte';
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  
  let isLogin = true;

  // Redirigir si ya está autenticado
  $: if ($auth.user) {
    goto('/');
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        {#if isLogin}
          ¿No tienes cuenta?
          <button
            on:click={() => (isLogin = false)}
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            Regístrate
          </button>
        {:else}
          ¿Ya tienes cuenta?
          <button
            on:click={() => (isLogin = true)}
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            Inicia sesión
          </button>
        {/if}
      </p>
    </div>

    <div class="mt-8">
      {#if isLogin}
        <LoginForm />
      {:else}
        <RegisterForm />
      {/if}
    </div>
  </div>
</div>