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

function buildFilters(
  year: string | null,
  month: string | null,
  startDate: string | null,
  endDate: string | null,
) {
  const filters: Record<string, unknown> = {};

  if (startDate && endDate) {
    filters.date = {
      gte: new Date(startDate + 'T00:00:00Z'),
      lte: new Date(endDate + 'T23:59:59Z'),
    };
  } else if (year && month) {
    const start = new Date(`${year}-${month}-01T00:00:00Z`);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);
    filters.date = { gte: start, lte: end };
  } else if (year) {
    filters.date = {
      gte: new Date(`${year}-01-01T00:00:00Z`),
      lte: new Date(`${year}-12-31T23:59:59Z`),
    };
  }

  return filters;
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
    const state     = searchParams.get('state');
    const startDate = searchParams.get('startDate');
    const endDate   = searchParams.get('endDate');

    const filters = buildFilters(year, month, startDate, endDate);

    const articles = await db.articles_mod.findMany({
      where: filters,
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

    // State filter applied in JS (mirrors /api/records approach)
    let filtered_articles: typeof articles = articles;

    if (state) {
      filtered_articles = articles
        .filter(
          (a) =>
            a.landslide_record?.locations.some(
              (l) => l.state_name?.toLowerCase() === state.toLowerCase(),
            ),
        )
        .map((a) => ({
          ...a,
          landslide_record: {
            ...a.landslide_record!,
            locations: a.landslide_record!.locations.filter(
              (l) => l.state_name?.toLowerCase() === state.toLowerCase(),
            ),
          },
        }));
    }

    return NextResponse.json({
      filtered_articles,
      filter_info: {
        total_articles:   articles.length,
        filtered_count:   filtered_articles.length,
        applied_filters:  { state, year, month, startDate, endDate },
      },
    });
  } catch (error) {
    console.error('Error in /api/records-org:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
