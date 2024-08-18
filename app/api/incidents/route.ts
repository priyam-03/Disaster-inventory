import { NextResponse } from 'next/server';
import {db} from '../../../lib/db';

export async function GET() {
    try {
        const incidents = await db.incident.findMany();
        return NextResponse.json(incidents);
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}
