import { writable } from 'svelte/store';

interface User {
  id: string;
  email: string;
  name?: string;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<{
    user: User | null;
    token: string | null;
  }>({
    user: null,
    token: null
  });

  return {
    subscribe,
    setUser: (user: User | null) => update(state => ({ ...state, user })),
    setToken: (token: string | null) => update(state => ({ ...state, token })),
    logout: () => set({ user: null, token: null })
  };
}

export const auth = createAuthStore();