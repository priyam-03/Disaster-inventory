import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
// import redis from '../../../lib/redis'; // Redis client
export const dynamic = 'force-dynamic';

// Helper function to parse and apply filters
function buildFilters(year: string | null, month: string | null, startDate: string | null, endDate: string | null) {
  const filters: any = {};
  
  // Ensure we only get records with landslide data
  if (filters.NOT && filters.NOT.landslide_record === null) {
    filters.landslide_record = {
      locations: {
        isEmpty: false,
      },
      landslide_report: "yes"
    };
  }

  // Handle date range filtering
  if (startDate && endDate) {
    // Date range filter takes precedence over month/year
    const start = new Date(startDate + 'T00:00:00Z');
    const end = new Date(endDate + 'T23:59:59Z');
    
    filters.date = {
      gte: start,
      lte: end,
    };
  } else if (year && month) {
    // Month and year specific filter
    const startDateObj = new Date(`${year}-${month}-01T00:00:00Z`);
    const endDateObj = new Date(startDateObj);
    endDateObj.setMonth(startDateObj.getMonth() + 1); // Go to the next month
    endDateObj.setDate(0); // Last day of the previous month
    endDateObj.setHours(23, 59, 59, 999); // End of the day
    
    filters.date = {
      gte: startDateObj,
      lte: endDateObj,
    };
  } else if (year && !month) {
    // Year only filter
    const startDateObj = new Date(`${year}-01-01T00:00:00Z`);
    const endDateObj = new Date(`${year}-12-31T23:59:59Z`);
    
    filters.date = {
      gte: startDateObj,
      lte: endDateObj,
    };
  }

  return filters;
}

// Helper function to generate a unique cache key
function generateCacheKey(year: string | null, month: string | null, state: string | null, startDate: string | null, endDate: string | null) {
  const dateKey = startDate && endDate ? `${startDate}_${endDate}` : `${year || 'all'}_${month || 'all'}`;
  return `articles:${dateKey}:${state || 'all'}`;
}

// GET request to fetch all NewsArticles with optional filters
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const state = searchParams.get('state');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Generate a unique cache key based on the request parameters
    // const cacheKey = generateCacheKey(year, month, state, startDate, endDate);

    // Check if the data is cached in Redis
    // const cachedData = await redis.get(cacheKey);
    // if (cachedData) {
    //   console.log('Returning cached data');
    //   return NextResponse.json({ filtered_articles: JSON.parse(cachedData) });
    // }

    // Build filters dynamically based on the optional parameters
    const filters = buildFilters(year, month, startDate, endDate);

    console.log('Applied filters:', JSON.stringify(filters, null, 2));

    // Fetch the data using Prisma with the built filters
    const articles = await db.articles_mod.findMany({
      where: filters,
      select: {
        id: true,
        title: true,
        link: true,
        contents: true,
        published: true,
        date: true,
        landslide_record: true,
      },
      orderBy: {
        date: 'desc', // Order by date descending (newest first)
      },
    });
    
    console.log(`Fetched ${articles.length} articles from the database`);

    // Filter the articles by state if the state parameter is provided
    let filtered_articles = articles;
    
    if (state) {
      filtered_articles = articles.map((article) => {
        if (article.landslide_record) {
          const locations = article.landslide_record.locations;
          const filtered_location = locations.filter((location) => location.state_name === state);
          
          // Only return articles that have locations in the specified state
          if (filtered_location.length > 0) {
            return {
              ...article,
              landslide_record: {
                ...article.landslide_record,
                locations: filtered_location
              }
            };
          }
          return null; // Filter out articles with no matching locations
        }
        return null; // Filter out articles without landslide records
      }).filter(article => article !== null); // Remove null entries
    }

    console.log(`Final filtered articles count: ${filtered_articles.length}`);

    // Add some debug information about date filtering
    if (startDate && endDate) {
      console.log(`Date range filter: ${startDate} to ${endDate}`);
    } else if (year && month) {
      console.log(`Month/Year filter: ${month}/${year}`);
    } else if (year) {
      console.log(`Year filter: ${year}`);
    }

    // Cache the fetched data in Redis with an expiry (e.g., 1 hour = 3600 seconds)
    // await redis.set(cacheKey, JSON.stringify(filtered_articles), 'EX', 3600);

    return NextResponse.json({ 
      filtered_articles,
      filter_info: {
        total_articles: articles.length,
        filtered_count: filtered_articles.length,
        applied_filters: {
          state,
          year,
          month,
          startDate,
          endDate
        }
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}