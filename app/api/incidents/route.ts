import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic'; 
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const state = searchParams.get('state');
        const month = searchParams.get('month');

        const whereClause: any = {};

        if (state) {
            whereClause.state = state;
        }

        if (month) {
            const [year, monthNumber] = month.split('-');
            const startDate = new Date(parseInt(year), parseInt(monthNumber) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(monthNumber), 0);

            whereClause.date = {
                gte: startDate,
                lte: endDate,
            };
        }

        const incidents = await db.incident.findMany({
            where: whereClause,
        });

        return NextResponse.json(incidents);
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}
