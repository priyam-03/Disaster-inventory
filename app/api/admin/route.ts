import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
// import redis from '../../../lib/redis'; // Redis client
export const dynamic = 'force-dynamic';



// Helper function to generate a unique cache key
function generateCacheKey(year: string | null, month: string | null, state: string | null) {
  return `articles:${year || 'all'}:${month || 'all'}:${state || 'all'}`;
}

// GET request to fetch all NewsArticles with optional filters
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;
    // Generate a unique cache key based on the request parameters
    // const cacheKey = generateCacheKey(year, month, state);

    // Check if the data is cached in Redis
    // const cachedData = await redis.get(cacheKey);
    // if (cachedData) {
    //   console.log('Returning cached data');
    //   return NextResponse.json({ filtered_articles: JSON.parse(cachedData) });
    // }

    // Build filters dynamically based on the optional parameters
   

    // Fetch the data using Prisma with the built filters
    const articles = await db.automate_test.findMany({
        where: {
           
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
      select: {
        id: true,
        title: true,
        link: true,
        contents: true,
        published: true,
        date: true,
        landslide_record: true,
      },
    });
    console.log(`Fetched ${articles.length} articles from the database`);

    // Filter the articles by state if the state parameter is provided
    
    // Cache the fetched data in Redis with an expiry (e.g., 1 hour = 3600 seconds)
    // await redis.set(cacheKey, JSON.stringify(filtered_articles), 'EX', 3600);

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
