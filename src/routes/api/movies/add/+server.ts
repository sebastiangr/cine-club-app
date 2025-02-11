import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/server/db';
import { verifyToken } from '$lib/server/auth/jwt';

export const POST: RequestHandler = async ({ request }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const userId = verifyToken(token || '');

    if (!userId) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { movieId } = await request.json(); // Only capture movieId

    try {
        const movieRecommendation = await prisma.movieRecommendation.create({
            data: {
                movieId,
                userId, // Save the user ID
            },
        });

        return json(movieRecommendation);
    } catch (error) {
        return json({ error: 'Failed to add movie recommendation' }, { status: 500 });
    }
};
