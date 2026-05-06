'use client';

import { useState } from 'react';

const INDIAN_STATES = [
  '', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Jammu and Kashmir', 'Ladakh',
];

const YEARS = ['', '2024', '2023', '2022', '2021', '2020'];
const MONTHS = [
  { value: '', label: 'All months' },
  { value: '01', label: '01 — January' },
  { value: '02', label: '02 — February' },
  { value: '03', label: '03 — March' },
  { value: '04', label: '04 — April' },
  { value: '05', label: '05 — May' },
  { value: '06', label: '06 — June' },
  { value: '07', label: '07 — July' },
  { value: '08', label: '08 — August' },
  { value: '09', label: '09 — September' },
  { value: '10', label: '10 — October' },
  { value: '11', label: '11 — November' },
  { value: '12', label: '12 — December' },
];

type Result = { status: number; data: unknown; url: string } | null;

function statusColor(status: number) {
  if (status === 200) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (status === 401) return 'bg-red-100 text-red-700 border-red-200';
  if (status === 500) return 'bg-red-100 text-red-700 border-red-200';
  if (status === 0)   return 'bg-slate-100 text-slate-600 border-slate-200';
  return 'bg-amber-100 text-amber-700 border-amber-200';
}

export function ApiTester({ endpoint }: { endpoint: string }) {
  const [open, setOpen]       = useState(false);
  const [apiKey, setApiKey]   = useState('');
  const [state, setState]     = useState('');
  const [year, setYear]       = useState('');
  const [month, setMonth]     = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate]     = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<Result>(null);

  function buildUrl() {
    const sp = new URLSearchParams();
    if (state)     sp.set('state', state);
    if (year)      sp.set('year', year);
    if (month)     sp.set('month', month);
    if (startDate) sp.set('startDate', startDate);
    if (endDate)   sp.set('endDate', endDate);
    const qs = sp.toString();
    return `${endpoint}${qs ? '?' + qs : ''}`;
  }

  async function send() {
    setLoading(true);
    setResult(null);
    const url = buildUrl();
    try {
      const res = await fetch(url, {
        headers: { 'X-API-Key': apiKey },
      });
      const data = await res.json();
      setResult({ status: res.status, data, url });
    } catch {
      setResult({ status: 0, data: { error: 'Network error or CORS issue.' }, url });
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder:text-slate-400';
  const labelCls = 'block text-xs font-semibold text-slate-500 mb-1';

  return (
    <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50/40 overflow-hidden">

      {/* Toggle header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Try it out
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-indigo-100">

          {/* API Key */}
          <div className="mt-4">
            <label className={labelCls}>X-API-Key <span className="text-red-400">*</span></label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className={inputCls}
            />
          </div>

          {/* Filters grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div>
              <label className={labelCls}>state</label>
              <select value={state} onChange={(e) => setState(e.target.value)} className={inputCls}>
                <option value="">All states</option>
                {INDIAN_STATES.filter(Boolean).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} className={inputCls}>
                <option value="">All years</option>
                {YEARS.filter(Boolean).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>month <span className="font-normal text-slate-400">(requires year)</span></label>
              <select value={month} onChange={(e) => setMonth(e.target.value)} className={inputCls}>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>startDate</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>endDate</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* URL preview */}
          <div className="mt-4 rounded-lg bg-slate-900 px-4 py-3 flex items-center gap-3 overflow-x-auto">
            <span className="text-emerald-400 text-xs font-mono font-bold shrink-0">GET</span>
            <span className="text-slate-100 text-xs font-mono whitespace-nowrap">{buildUrl()}</span>
          </div>

          {/* Send button */}
          <button
            onClick={send}
            disabled={loading || !apiKey}
            className="mt-4 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-semibold py-2.5 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Sending…
              </>
            ) : 'Send Request'}
          </button>

          {/* Response */}
          {result && (
            <div className="mt-5">
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-block px-2 py-0.5 rounded border text-xs font-mono font-bold ${statusColor(result.status)}`}>
                  {result.status === 0 ? 'ERROR' : result.status}
                </span>
                <span className="text-xs text-slate-500">
                  {result.status === 200 ? 'OK' : result.status === 401 ? 'Unauthorized' : result.status === 500 ? 'Server Error' : 'Network Error'}
                </span>
              </div>
              <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-auto text-xs leading-relaxed max-h-96">
                <code>{JSON.stringify(result.data, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
