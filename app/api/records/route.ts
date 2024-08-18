import { NextResponse } from 'next/server';
import {db} from '../../../lib/db';
export async function GET() {
    try {
        const records = await db.record.findMany({
            include: {
                landslideRecord: {
                    include: {
                        locations: true,
                    },
                },
            },
        });

        return NextResponse.json(records);
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}
