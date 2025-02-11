import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/server/db';
import { verifyPassword } from '$lib/server/auth/password';
import { createToken } from '$lib/server/auth/jwt';
import { authenticateUser } from '$lib/server/auth'; // Your authentication logic

export const POST: RequestHandler = async ({ request }) => {
  const { email, password } = await request.json();
  const user = await authenticateUser(email, password);

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return json({ error: 'Usuario no encontrado' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    const token = createToken(user.id);

    return json({
      user: { id: user.id, email: user.email, name: user.name },
      token
    });
  } catch (error) {
    return json({ error: 'Error al iniciar sesión' }, { status: 400 });
  }

  if (user) {
    return json(user); // Return user data on successful login
  } else {
      return json({ error: 'Invalid credentials' }, { status: 401 });
  }
};