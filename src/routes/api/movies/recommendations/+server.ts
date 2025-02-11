import { json } from '@sveltejs/kit';
import prisma from '$lib/server/db'; // Import the database connection

// Fetch recommendations from the database
export async function GET() {
    const recommendations = await prisma.movieRecommendation.findMany();
    return json(recommendations);
}
