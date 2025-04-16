// app/locations/page.tsx

export default function LocationsLandingPage() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-20">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6">
            Explore Landslide Data
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10">
            Dive into interactive visualizations of historical landslide occurrences across India.
            Filter by state, year, and month — and see exactly where and when they happened.
          </p>
  
          <a 
            href="/locations" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
            View Map
          </a>
        </div>
      </div>
    )
  }
  