import Link from 'next/link'
import { FaMapMarkerAlt, FaLayerGroup, FaArrowRight } from 'react-icons/fa'

export default function LocationsLandingPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-brand-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-brand-300/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-100 rounded-full mb-6">
          <FaMapMarkerAlt className="text-brand-500 text-[10px]" />
          <span className="text-xs font-semibold text-brand-600 tracking-wide">DISASTER INVENTORY</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
          <span className="text-surface-800">Explore </span>
          <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">Landslide Data</span>
        </h1>

        <p className="text-lg text-surface-400 mb-10 max-w-xl mx-auto leading-relaxed">
          Dive into interactive visualizations of historical landslide occurrences across India.
          Filter by state, year, and date range to see exactly where and when they happened.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/home"
            className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-brand-600 to-brand-700
              hover:from-brand-700 hover:to-brand-800 text-white font-semibold px-7 py-3.5 rounded-xl
              transition-all duration-300 hover:shadow-glow-lg active:scale-[0.98]"
          >
            <FaLayerGroup className="text-sm" />
            View Map
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  )
}
