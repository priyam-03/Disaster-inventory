import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

function verifyApiKey(key: string | null): boolean {
  const expected = process.env.ARTICLE_LOCATIONS_API_KEY ?? '';
  if (!expected || !key) return false;
  return key === expected;
}

// ---------------------------------------------------------------------------
// Date filter builder (mirrors /api/records logic)
// ---------------------------------------------------------------------------

function buildDateFilter(
  year: string | null,
  month: string | null,
  startDate: string | null,
  endDate: string | null,
): { gte?: Date; lte?: Date } | null {
  if (startDate && endDate) {
    return {
      gte: new Date(startDate + 'T00:00:00Z'),
      lte: new Date(endDate + 'T23:59:59Z'),
    };
  }
  if (year && month) {
    const start = new Date(`${year}-${month}-01T00:00:00Z`);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);
    return { gte: start, lte: end };
  }
  if (year) {
    return {
      gte: new Date(`${year}-01-01T00:00:00Z`),
      lte: new Date(`${year}-12-31T23:59:59Z`),
    };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export async function GET(req: Request) {
  if (!verifyApiKey(req.headers.get('X-API-Key'))) {
    return NextResponse.json(
      { error: 'Invalid or missing API key. Pass it as the X-API-Key request header.' },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(req.url);

    const year      = searchParams.get('year');
    const month     = searchParams.get('month');
    const startDate = searchParams.get('startDate');
    const endDate   = searchParams.get('endDate');
    const state     = searchParams.get('state');

    const dateFilter = buildDateFilter(year, month, startDate, endDate);

    const articles = await db.articles_mod.findMany({
      where: {
        ...(dateFilter ? { date: dateFilter } : {}),
      },
      select: {
        id:               true,
        title:            true,
        link:             true,
        published:        true,
        date:             true,
        landslide_record: true,
      },
      orderBy: { date: 'desc' },
    });

    // Flatten: one record per location
    let results: Record<string, unknown>[] = [];

    for (const article of articles) {
      const locations = article.landslide_record?.locations ?? [];

      for (const loc of locations) {
        results.push({
          article_id:   article.id,
          title:        article.title,
          link:         article.link,
          published:    article.published,
          article_date: article.date,
          source_name:  article.landslide_record?.source_name ?? null,

          nearby:                 loc.nearby,
          road_name:              loc.road_name,
          village_town:           loc.village_town,
          village_town_name:      loc.village_name_town_name,
          area_name:              loc.area_name,
          district_name:          loc.district_name,
          state_name:             loc.state_name,
          landslide_type:         loc.landslide_type,
          casualty_description:   loc.casualty_description,
          landslide_size:         loc.landslide_size,
          triggering_factor:      loc.triggering_factor,
          infrastructural_damage: loc.infrastructural_damage,
          location_date:          loc.date,
          location_time:          loc.time,
          pincode:                loc.pincode,
          lat:                    loc.lat,
          lon:                    loc.lon,
          address:                loc.address,
        });
      }
    }

    // State filter applied in JS (mirrors /api/records approach)
    if (state) {
      results = results.filter(
        r => typeof r.state_name === 'string' && r.state_name.toLowerCase() === state.toLowerCase(),
      );
    }

    return NextResponse.json({
      total_locations: results.length,
      applied_filters: { year, month, startDate, endDate, state },
      results,
    });
  } catch (error) {
    console.error('Error in /api/article-locations:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
