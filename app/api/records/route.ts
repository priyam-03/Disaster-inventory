import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
// import redis from '../../../lib/redis'; // Redis client
export const dynamic = 'force-dynamic';

// Helper function to parse and apply filters
function buildFilters(year: string | null, month: string | null) {
  const filters: any = {};
  if (filters.NOT && filters.NOT.landslide_record === null) {
    filters.landslide_record = {
      locations: {
        isEmpty: false,
      },
    };
  }
  if (year) {
    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${year}-12-31T23:59:59Z`);
    filters.date = {
      gte: startDate,
      lte: endDate,
    };
  }

  if (month && year) {
    const startDate = new Date(`${year}-${month}-01T00:00:00Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1); // Go to the next month
    endDate.setDate(0); // Last day of the previous month
    filters.date = {
      gte: startDate,
      lte: endDate,
    };
  }
  return filters;
}

// Helper function to generate a unique cache key
function generateCacheKey(year: string | null, month: string | null, state: string | null) {
  return `articles:${year || 'all'}:${month || 'all'}:${state || 'all'}`;
}

// GET request to fetch all NewsArticles with optional filters
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const state = searchParams.get('state');

    // Generate a unique cache key based on the request parameters
    // const cacheKey = generateCacheKey(year, month, state);

    // Check if the data is cached in Redis
    // const cachedData = await redis.get(cacheKey);
    // if (cachedData) {
    //   console.log('Returning cached data');
    //   return NextResponse.json({ filtered_articles: JSON.parse(cachedData) });
    // }

    // Build filters dynamically based on the optional parameters
    const filters = buildFilters(year, month);

    // Fetch the data using Prisma with the built filters
    const articles = await db.articles_mod.findMany({
      where: filters,
    });

    // Filter the articles by state if the state parameter is provided
    const filtered_articles = articles.map((article) => {
      if (state) {
        if (article.landslide_record) {
          const locations = article.landslide_record.locations;
          const filtered_location = locations.filter((location) => location.state_name === state);
          article.landslide_record.locations = filtered_location;
          return article;
        }
      } else {
        return article;
      }
    });

    console.log(`Fetched ${filtered_articles.length} articles from the database`);

    // Cache the fetched data in Redis with an expiry (e.g., 1 hour = 3600 seconds)
    // await redis.set(cacheKey, JSON.stringify(filtered_articles), 'EX', 3600);

    return NextResponse.json({ filtered_articles });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
