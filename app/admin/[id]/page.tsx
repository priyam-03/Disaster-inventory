// app/articles/[id]/page.tsx
// 'use client'

import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import React from 'react';
import { toggleApproval } from './action'

interface Props {
  params: { id: string };
}

interface LandslideLocation {
  nearby?: string;
  road_name?: string;
  village_name?: string;
  area_name?: string;
  district_name?: string;
  state_name?: string;
  infrastructural_damage?: string;
  lat?: number;
  lon?: number;
  date?: string;
}

interface LandslideRecord {
  landslide_report: string;
  source_name?: string;
  locations: LandslideLocation[];
}

interface Article {
  id: string;
  title: string;
  link: string;
  published: string;
  contents: string;
  date: string;
  landslide_record?: LandslideRecord;
  is_approved?: boolean;
}
export default async function ArticleDetails({ params }: Props) {
  const article = await db.automate_test.findUnique({
    where: { id: params.id },
    include: {
      landslide_record: {
        include: {
          locations: true,
        },
      },
    },
  }) as Article | null;

  if (!article) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-3xl font-bold text-blue-700">{article.title}</h1>
      <p className="text-sm text-gray-500">Published: {new Date(article.date).toLocaleString()}</p>
      < div className="prose max-w-none" style={{ color: 'black', all: 'unset' }}>
        <p style={{ all: 'unset', color: 'black' }}>{article.contents}</p>
      </div>

      {article.landslide_record?.locations.map((loc, i) => (
        <div key={i} className="text-sm text-gray-600 space-y-1 border-b pb-2 mb-2">
          <p>📍 {loc.village_name || 'N/A'}, {loc.district_name || 'N/A'}, {loc.state_name || 'N/A'}</p>
          <p>🛣️ Damage: {loc.infrastructural_damage || 'N/A'}</p>
          <p>🗓️ Date: {loc.date || 'N/A'}</p>
          <p>🌐 Lat/Lon: {loc.lat ?? 'N/A'}, {loc.lon ?? 'N/A'}</p>
          <p>✅ Status: {article.is_approved ? 'Approved' : 'Rejected'}</p>

          <form
            action={async () => {
              'use server'
              await toggleApproval(params.id!, !article.is_approved)
            }}
          >
            <button
              type="submit"
              className={`px-3 py-1 rounded text-sm text-gray-600 ${article.is_approved ? 'bg-red-500' : 'bg-green-600'}`}
            >
              {article.is_approved ? 'Reject' : 'Approve'}
            </button>
          </form>
        </div>
      ))}

    </div>
  );
}