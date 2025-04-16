'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LogoutBtn from './LogoutBtn';
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
}

const getDefaultDates = (range: '7' | '30' = '7') => {
  const today = new Date();
  const past = new Date(today);
  past.setDate(today.getDate() - (range === '30' ? 30 : 7));

  const format = (d: Date) => d.toISOString().split('T')[0];

  return {
    defaultStart: format(past),
    defaultEnd: format(today),
  };
};

const ArticlesList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<'7' | '30' | 'custom'>(searchParams.get('mode') as any || '7');
  const { defaultStart, defaultEnd } = mode === 'custom' ? { defaultStart: '', defaultEnd: '' } : getDefaultDates(mode);
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || defaultStart);
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || defaultEnd);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async (start: string, end: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin?startDate=${start}&endDate=${end}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(startDate, endDate);
  }, [startDate, endDate]);

  const handleFilterChange = (e: React.FormEvent) => {
    e.preventDefault();

    let start = startDate;
    let end = endDate;

    if (mode !== 'custom') {
      const dates = getDefaultDates(mode);
      start = dates.defaultStart;
      end = dates.defaultEnd;
      setStartDate(start);
      setEndDate(end);
    }

    const params = new URLSearchParams();
    params.set('startDate', start);
    params.set('endDate', end);
    params.set('mode', mode);
    router.push(`?${params.toString()}`);
  };

  const truncateText = (text: string, maxLength = 200) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <form onSubmit={handleFilterChange} className="flex flex-wrap items-end gap-4 border-b pb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date Range</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {mode === 'custom' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          Apply
        </button>
      </form>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : !articles.length ? (
        <p className="text-gray-500">No articles found for the selected date range.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
             <div
             key={article.id}
             onClick={() => router.push(`/admin/${article.id}`)}
             className="cursor-pointer border border-gray-300 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition duration-200"
           >
              <div>
                <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                  <a href={article.link} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </h2>

                <p className="text-xs text-gray-500 mb-2">
                  Published: {new Date(article.date).toLocaleString()}
                </p>

                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {truncateText(article.contents, 200)}
                </p>
              </div>

              {article.landslide_record && (
                <div className="mt-4 bg-gray-50 p-3 rounded">
                  <p className="font-semibold text-gray-700">📌 Landslide Info:</p>

                  {article.landslide_record.locations.map((location, i) => (
                    <div key={i} className="text-xs text-gray-600 mt-2">
                      <p>📍 {location.village_name || 'N/A'}, {location.district_name || 'N/A'}, {location.state_name || 'N/A'}</p>
                      <p>🛣️ Damage: {location.infrastructural_damage || 'N/A'}</p>
                      <p>🗓️ {location.date || 'N/A'}</p>
                      <p>🌐 {location.lat ?? 'N/A'}, {location.lon ?? 'N/A'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

     
    </div>
  );
};

export default ArticlesList;
