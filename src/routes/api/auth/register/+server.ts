import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/server/db';
import { hashPassword } from '$lib/server/auth/password';
import { createToken } from '$lib/server/auth/jwt';

export const POST: RequestHandler = async ({ request }) => {
  const { email, password, name } = await request.json();

  try {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    const token = createToken(user.id);

    return json({
      user: { id: user.id, email: user.email, name: user.name },
      token
    });
  } catch (error) {
    return json({ error: 'Error al registrar usuario' }, { status: 400 });
  }
};