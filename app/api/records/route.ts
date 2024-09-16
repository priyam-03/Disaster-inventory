import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

// Helper function to parse and apply filters
function buildFilters(year: string|null, month: string|null) {
  const filters: any = {
 
   
  
  };
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

// GET request to fetch all NewsArticles with optional filters
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const state = searchParams.get('state');

    // Build filters dynamically based on the optional parameters
    const filters = buildFilters(year, month);

    // Fetch the data using Prisma with the built filters
    const articles = await db.articles_mod.findMany({
      where: filters,
    });
    const filtered_articles = articles.map((article) => {
      if(state){
      if(article.landslide_record){
           const locations = article.landslide_record.locations;
           const filtered_location = locations.filter((location) => location.state_name == state);
           
              article.landslide_record.locations = filtered_location
              return article;
           
           
      }

        
        // else{
        //   return article.landslide_record.locations?.length>0;
        // }
      }
      else return article;
    })
    
    return NextResponse.json({ filtered_articles });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
