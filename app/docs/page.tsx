import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation — Landslide Records',
  description: 'API reference for the Landslide Records public API.',
};

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Jammu and Kashmir', 'Ladakh',
];

function Badge({ children, color = 'green' }: { children: React.ReactNode; color?: 'green' | 'blue' | 'slate' }) {
  const colors = {
    green: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-indigo-100 text-indigo-700',
    slate: 'bg-slate-100 text-slate-600',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 mt-3">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-2.5 font-semibold text-slate-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-slate-700 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm mt-3 leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-xl font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">{title}</h2>
      {children}
    </section>
  );
}

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-1">API Reference</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Landslide Records API</h1>
        <p className="text-slate-500">Public REST API for accessing landslide news records across India.</p>
      </div>

      {/* Endpoint header */}
      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-5 py-4 mb-10 shadow-sm">
        <Badge color="green">GET</Badge>
        <span className="font-mono text-slate-800 font-medium">/api/records</span>
        <span className="ml-auto text-xs text-slate-400">No authentication required</span>
      </div>

      {/* Overview */}
      <Section id="overview" title="Overview">
        <p className="text-slate-600 leading-relaxed">
          Returns a list of landslide-related news articles extracted from various Indian news sources.
          Each article includes structured landslide data such as location, type, triggering factor, and
          casualty information. Results are ordered by date descending (newest first).
        </p>
      </Section>

      {/* Query Parameters */}
      <Section id="parameters" title="Query Parameters">
        <Table
          headers={['Parameter', 'Type', 'Required', 'Description']}
          rows={[
            [<code key="s" className="text-indigo-600 font-mono">state</code>, 'string', 'No', 'Filter by Indian state name (e.g. Kerala, Uttarakhand)'],
            [<code key="y" className="text-indigo-600 font-mono">year</code>, 'string', 'No', 'Filter by year (e.g. 2023)'],
            [<code key="m" className="text-indigo-600 font-mono">month</code>, 'string', 'No', '2-digit month (e.g. 07). Must be used with year.'],
            [<code key="sd" className="text-indigo-600 font-mono">startDate</code>, 'string', 'No', 'Range start in YYYY-MM-DD. Must be used with endDate.'],
            [<code key="ed" className="text-indigo-600 font-mono">endDate</code>, 'string', 'No', 'Range end in YYYY-MM-DD. Must be used with startDate.'],
          ]}
        />
        <p className="text-sm text-slate-500 mt-3">
          <strong className="text-slate-600">Filter precedence:</strong> date range (startDate + endDate) &gt; month + year &gt; year only.
        </p>
      </Section>

      {/* Example Requests */ }
      <Section id="examples" title="Example Requests">
        <div className="space-y-4">
          {[
            { label: 'All records', code: 'GET /api/records' },
            { label: 'Filter by state', code: 'GET /api/records?state=Kerala' },
            { label: 'Filter by year', code: 'GET /api/records?year=2023' },
            { label: 'Filter by month and year', code: 'GET /api/records?year=2023&month=07' },
            { label: 'Filter by date range', code: 'GET /api/records?startDate=2023-06-01&endDate=2023-08-31' },
            { label: 'State + date range', code: 'GET /api/records?state=Uttarakhand&startDate=2023-06-01&endDate=2023-08-31' },
          ].map(({ label, code }) => (
            <div key={label}>
              <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
              <CodeBlock code={code} />
            </div>
          ))}
        </div>
      </Section>

      {/* Response */}
      <Section id="response" title="Response — 200 OK">
        <CodeBlock code={`{
  "filtered_articles": [
    {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "title": "Landslide blocks NH44 in Ramban district",
      "link": "https://source-article-url.com",
      "published": "Mon, 10 Jul 2023 08:30:00 GMT",
      "date": "2023-07-10T00:00:00.000Z",
      "landslide_record": {
        "landslide_report": "yes",
        "source_name": "Times of India",
        "locations": [
          {
            "state_name": "Jammu and Kashmir",
            "district_name": "Ramban",
            "area_name": "Ramban",
            "village_name_town_name": null,
            "road_name": "NH44",
            "nearby": "Ramban",
            "lat": 33.24,
            "lon": 75.26,
            "pincode": 182144,
            "address": "NH44, Ramban, J&K",
            "landslide_type": "debris flow",
            "triggering_factor": "rainfall",
            "landslide_size": "medium",
            "casualty_description": "2 injured",
            "infrastructural_damage": "road blocked",
            "date": "2023-07-10",
            "time": "06:30"
          }
        ]
      }
    }
  ],
  "filter_info": {
    "total_articles": 542,
    "filtered_count": 12,
    "applied_filters": {
      "state": "Jammu and Kashmir",
      "year": null,
      "month": null,
      "startDate": "2023-07-01",
      "endDate": "2023-07-31"
    }
  }
}`} />

        <h3 className="text-base font-semibold text-slate-700 mt-6 mb-1">Top-level fields</h3>
        <Table
          headers={['Field', 'Type', 'Description']}
          rows={[
            [<code key="fa" className="text-indigo-600 font-mono">filtered_articles</code>, 'array', 'List of matched articles'],
            [<code key="ta" className="text-indigo-600 font-mono">filter_info.total_articles</code>, 'number', 'Total records before state filter'],
            [<code key="fc" className="text-indigo-600 font-mono">filter_info.filtered_count</code>, 'number', 'Count after all filters applied'],
            [<code key="af" className="text-indigo-600 font-mono">filter_info.applied_filters</code>, 'object', 'Echo of the query params received'],
          ]}
        />

        <h3 className="text-base font-semibold text-slate-700 mt-6 mb-1">Article fields</h3>
        <Table
          headers={['Field', 'Type', 'Description']}
          rows={[
            [<code key="id" className="text-indigo-600 font-mono">id</code>, 'string', 'MongoDB ObjectId'],
            [<code key="ti" className="text-indigo-600 font-mono">title</code>, 'string', 'News article headline'],
            [<code key="li" className="text-indigo-600 font-mono">link</code>, 'string', 'URL to original article'],
            [<code key="pu" className="text-indigo-600 font-mono">published</code>, 'string', 'Raw publish date string from feed'],
            [<code key="da" className="text-indigo-600 font-mono">date</code>, 'string | null', 'ISO 8601 date'],
            [<code key="lr" className="text-indigo-600 font-mono">landslide_record</code>, 'object | null', 'Structured landslide data extracted from the article'],
          ]}
        />

        <h3 className="text-base font-semibold text-slate-700 mt-6 mb-1">Location fields (inside <code className="text-indigo-600 font-mono">landslide_record.locations[]</code>)</h3>
        <Table
          headers={['Field', 'Type', 'Description']}
          rows={[
            [<code key="sn" className="text-indigo-600 font-mono">state_name</code>, 'string | null', 'Indian state'],
            [<code key="dn" className="text-indigo-600 font-mono">district_name</code>, 'string | null', 'District'],
            [<code key="an" className="text-indigo-600 font-mono">area_name</code>, 'string | null', 'Area / locality'],
            [<code key="vn" className="text-indigo-600 font-mono">village_name_town_name</code>, 'string | null', 'Village or town name'],
            [<code key="rn" className="text-indigo-600 font-mono">road_name</code>, 'string | null', 'Affected road'],
            [<code key="nb" className="text-indigo-600 font-mono">nearby</code>, 'string | null', 'Nearby landmark'],
            [<code key="la" className="text-indigo-600 font-mono">lat</code>, 'number | null', 'Latitude'],
            [<code key="lo" className="text-indigo-600 font-mono">lon</code>, 'number | null', 'Longitude'],
            [<code key="pi" className="text-indigo-600 font-mono">pincode</code>, 'number | null', 'PIN code'],
            [<code key="ad" className="text-indigo-600 font-mono">address</code>, 'string | null', 'Full address string'],
            [<code key="lt" className="text-indigo-600 font-mono">landslide_type</code>, 'string | null', 'e.g. debris flow, rockfall, mudslide'],
            [<code key="tf" className="text-indigo-600 font-mono">triggering_factor</code>, 'string | null', 'e.g. rainfall, earthquake'],
            [<code key="ls" className="text-indigo-600 font-mono">landslide_size</code>, 'string | null', 'e.g. small, medium, large'],
            [<code key="cd" className="text-indigo-600 font-mono">casualty_description</code>, 'string | null', 'Free-text casualty information'],
            [<code key="id2" className="text-indigo-600 font-mono">infrastructural_damage</code>, 'string | null', 'Free-text damage information'],
            [<code key="dt" className="text-indigo-600 font-mono">date</code>, 'string | null', 'Incident date parsed from article text'],
            [<code key="ti2" className="text-indigo-600 font-mono">time</code>, 'string | null', 'Incident time parsed from article text'],
          ]}
        />
      </Section>

      {/* Error */}
      <Section id="errors" title="Error Response">
        <div className="flex items-center gap-3 mb-2">
          <Badge color="slate">500</Badge>
          <span className="text-sm text-slate-600">Internal Server Error</span>
        </div>
        <CodeBlock code={`{ "error": "Failed to fetch data" }`} />
      </Section>

      {/* Notes */}
      <Section id="notes" title="Notes">
        <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm leading-relaxed">
          <li>Results are always ordered by <code className="text-indigo-600 font-mono">date</code> descending (newest first).</li>
          <li>When filtering by <code className="text-indigo-600 font-mono">state</code>, only locations matching that state are returned inside each article&apos;s <code className="text-indigo-600 font-mono">locations</code> array.</li>
          <li><code className="text-indigo-600 font-mono">month</code> must be used together with <code className="text-indigo-600 font-mono">year</code>; it has no effect on its own.</li>
          <li><code className="text-indigo-600 font-mono">startDate</code> and <code className="text-indigo-600 font-mono">endDate</code> must both be provided for range filtering to apply.</li>
          <li>Articles where <code className="text-indigo-600 font-mono">landslide_record</code> is <code className="text-indigo-600 font-mono">null</code> may still appear in results when no filters are applied.</li>
        </ul>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* /api/article-locations                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="mt-16 mb-10">
        <div className="h-px bg-slate-200 mb-10" />
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-1">API Reference</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Article Locations API</h1>
        <p className="text-slate-500">Returns one record per landslide location — each enriched with its parent article&apos;s metadata. Requires an API key.</p>
      </div>

      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-5 py-4 mb-10 shadow-sm">
        <Badge color="green">GET</Badge>
        <span className="font-mono text-slate-800 font-medium">/api/article-locations</span>
        <span className="ml-auto text-xs text-slate-400">Requires X-API-Key header</span>
      </div>

      <Section id="al-overview" title="Overview">
        <p className="text-slate-600 leading-relaxed">
          Unlike <code className="text-indigo-600 font-mono">/api/records</code> which returns one article with a nested <code className="text-indigo-600 font-mono">locations</code> array,
          this endpoint <strong>flattens</strong> that array. A single article reporting three locations produces three separate records here — each carrying the article&apos;s
          title, link, and date alongside the individual location data. Useful for map rendering or per-location analysis.
        </p>
      </Section>

      <Section id="al-auth" title="Authentication">
        <p className="text-slate-600 text-sm mb-3">Pass your API key in the request header:</p>
        <CodeBlock code={`X-API-Key: your-secret-key`} />
        <p className="text-sm text-slate-500 mt-3">Missing or incorrect keys return <code className="text-indigo-600 font-mono">401 Unauthorized</code>.</p>
      </Section>

      <Section id="al-parameters" title="Query Parameters">
        <Table
          headers={['Parameter', 'Type', 'Required', 'Description']}
          rows={[
            [<code key="s" className="text-indigo-600 font-mono">state</code>, 'string', 'No', 'Filter by Indian state name — matched against location.state_name (case-insensitive)'],
            [<code key="y" className="text-indigo-600 font-mono">year</code>, 'string', 'No', 'Filter by year (e.g. 2023)'],
            [<code key="m" className="text-indigo-600 font-mono">month</code>, 'string', 'No', '2-digit month (e.g. 07). Must be used with year.'],
            [<code key="sd" className="text-indigo-600 font-mono">startDate</code>, 'string', 'No', 'Range start in YYYY-MM-DD. Must be used with endDate.'],
            [<code key="ed" className="text-indigo-600 font-mono">endDate</code>, 'string', 'No', 'Range end in YYYY-MM-DD. Must be used with startDate.'],
          ]}
        />
        <p className="text-sm text-slate-500 mt-3">
          <strong className="text-slate-600">Filter precedence:</strong> date range (startDate + endDate) &gt; month + year &gt; year only.
        </p>
      </Section>

      <Section id="al-states" title="Valid State Values">
        <p className="text-slate-600 text-sm mb-3">
          The <code className="text-indigo-600 font-mono">state</code> filter is matched case-insensitively against the <code className="text-indigo-600 font-mono">state_name</code> field
          stored in each location. Use the exact names below for reliable results:
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {INDIAN_STATES.map((s) => (
            <code key={s} className="bg-slate-100 text-slate-700 text-xs font-mono px-2 py-1 rounded">
              {s}
            </code>
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-4">
          Example: <code className="text-indigo-600 font-mono">?state=Uttarakhand</code> and <code className="text-indigo-600 font-mono">?state=uttarakhand</code> both work.
        </p>
      </Section>

      <Section id="al-examples" title="Example Requests">
        <div className="space-y-4">
          {[
            { label: 'All locations (API key required)', code: 'GET /api/article-locations\nX-API-Key: your-secret-key' },
            { label: 'Filter by state', code: 'GET /api/article-locations?state=Kerala\nX-API-Key: your-secret-key' },
            { label: 'Filter by year', code: 'GET /api/article-locations?year=2024\nX-API-Key: your-secret-key' },
            { label: 'Filter by month and year', code: 'GET /api/article-locations?year=2024&month=07\nX-API-Key: your-secret-key' },
            { label: 'Filter by date range', code: 'GET /api/article-locations?startDate=2024-06-01&endDate=2024-08-31\nX-API-Key: your-secret-key' },
            { label: 'State + date range', code: 'GET /api/article-locations?state=Himachal Pradesh&startDate=2024-06-01&endDate=2024-08-31\nX-API-Key: your-secret-key' },
          ].map(({ label, code }) => (
            <div key={label}>
              <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
              <CodeBlock code={code} />
            </div>
          ))}
        </div>
      </Section>

      <Section id="al-response" title="Response — 200 OK">
        <CodeBlock code={`{
  "total_locations": 3,
  "applied_filters": {
    "year": null,
    "month": null,
    "startDate": "2024-06-01",
    "endDate": "2024-08-31",
    "state": "Kerala"
  },
  "results": [
    {
      "article_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "title": "Landslide hits Wayanad, 3 dead",
      "link": "https://source-article-url.com",
      "published": "Mon, 10 Jul 2024 08:30:00 GMT",
      "article_date": "2024-07-10T00:00:00.000Z",
      "source_name": "The Hindu",
      "nearby": "Wayanad",
      "road_name": null,
      "village_town": null,
      "village_town_name": "Mundakkai",
      "area_name": "Mundakkai",
      "district_name": "Wayanad",
      "state_name": "Kerala",
      "landslide_type": "debris flow",
      "casualty_description": "3 dead, 5 injured",
      "landslide_size": "large",
      "triggering_factor": "rainfall",
      "infrastructural_damage": "houses destroyed",
      "location_date": "2024-07-10",
      "location_time": "03:00",
      "pincode": 673593,
      "lat": 11.58,
      "lon": 76.07,
      "address": "Mundakkai, Wayanad, Kerala"
    }
  ]
}`} />

        <h3 className="text-base font-semibold text-slate-700 mt-6 mb-1">Top-level fields</h3>
        <Table
          headers={['Field', 'Type', 'Description']}
          rows={[
            [<code key="tl" className="text-indigo-600 font-mono">total_locations</code>, 'number', 'Count of location records returned after all filters'],
            [<code key="af" className="text-indigo-600 font-mono">applied_filters</code>, 'object', 'Echo of the query params received'],
            [<code key="re" className="text-indigo-600 font-mono">results</code>, 'array', 'Flat list of location records, ordered by article date descending'],
          ]}
        />

        <h3 className="text-base font-semibold text-slate-700 mt-6 mb-1">Result record fields</h3>
        <Table
          headers={['Field', 'Type', 'Description']}
          rows={[
            [<code key="ai" className="text-indigo-600 font-mono">article_id</code>, 'string', 'MongoDB ObjectId of the parent article'],
            [<code key="ti" className="text-indigo-600 font-mono">title</code>, 'string', 'News article headline'],
            [<code key="li" className="text-indigo-600 font-mono">link</code>, 'string', 'URL to original article'],
            [<code key="pu" className="text-indigo-600 font-mono">published</code>, 'string', 'Raw publish date string from feed'],
            [<code key="ad" className="text-indigo-600 font-mono">article_date</code>, 'string | null', 'ISO 8601 date of the article'],
            [<code key="sn" className="text-indigo-600 font-mono">source_name</code>, 'string | null', 'News source name'],
            [<code key="nb" className="text-indigo-600 font-mono">nearby</code>, 'string | null', 'Nearby landmark'],
            [<code key="rn" className="text-indigo-600 font-mono">road_name</code>, 'string | null', 'Affected road'],
            [<code key="vt" className="text-indigo-600 font-mono">village_town_name</code>, 'string | null', 'Village or town name'],
            [<code key="an" className="text-indigo-600 font-mono">area_name</code>, 'string | null', 'Area / locality'],
            [<code key="dn" className="text-indigo-600 font-mono">district_name</code>, 'string | null', 'District'],
            [<code key="st" className="text-indigo-600 font-mono">state_name</code>, 'string | null', 'Indian state'],
            [<code key="lt" className="text-indigo-600 font-mono">landslide_type</code>, 'string | null', 'e.g. debris flow, rockfall, mudslide'],
            [<code key="cd" className="text-indigo-600 font-mono">casualty_description</code>, 'string | null', 'Free-text casualty information'],
            [<code key="ls" className="text-indigo-600 font-mono">landslide_size</code>, 'string | null', 'e.g. small, medium, large'],
            [<code key="tf" className="text-indigo-600 font-mono">triggering_factor</code>, 'string | null', 'e.g. rainfall, earthquake'],
            [<code key="id2" className="text-indigo-600 font-mono">infrastructural_damage</code>, 'string | null', 'Free-text damage information'],
            [<code key="ld" className="text-indigo-600 font-mono">location_date</code>, 'string | null', 'Incident date parsed from article text'],
            [<code key="lti" className="text-indigo-600 font-mono">location_time</code>, 'string | null', 'Incident time parsed from article text'],
            [<code key="pc" className="text-indigo-600 font-mono">pincode</code>, 'number | null', 'PIN code'],
            [<code key="la" className="text-indigo-600 font-mono">lat</code>, 'number | null', 'Latitude'],
            [<code key="lo" className="text-indigo-600 font-mono">lon</code>, 'number | null', 'Longitude'],
            [<code key="addr" className="text-indigo-600 font-mono">address</code>, 'string | null', 'Full address string used for geocoding'],
          ]}
        />
      </Section>

      <Section id="al-errors" title="Error Responses">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge color="slate">401</Badge>
              <span className="text-sm text-slate-600">Unauthorized — missing or invalid API key</span>
            </div>
            <CodeBlock code={`{ "error": "Invalid or missing API key. Pass it as the X-API-Key request header." }`} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge color="slate">500</Badge>
              <span className="text-sm text-slate-600">Internal Server Error</span>
            </div>
            <CodeBlock code={`{ "error": "Failed to fetch data" }`} />
          </div>
        </div>
      </Section>

      <Section id="al-notes" title="Notes">
        <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm leading-relaxed">
          <li>One article with <em>N</em> locations produces <em>N</em> records in the response.</li>
          <li>Results are ordered by <code className="text-indigo-600 font-mono">article_date</code> descending (newest first).</li>
          <li>State filtering is case-insensitive and matches on the <code className="text-indigo-600 font-mono">state_name</code> field inside each location, not on the article level.</li>
          <li>Locations without a <code className="text-indigo-600 font-mono">state_name</code> are excluded when the <code className="text-indigo-600 font-mono">state</code> filter is active.</li>
          <li><code className="text-indigo-600 font-mono">month</code> must be used together with <code className="text-indigo-600 font-mono">year</code>; it has no effect on its own.</li>
          <li><code className="text-indigo-600 font-mono">startDate</code> and <code className="text-indigo-600 font-mono">endDate</code> must both be provided for range filtering to apply.</li>
        </ul>
      </Section>

    </div>
  );
}
