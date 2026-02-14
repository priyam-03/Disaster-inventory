import React from 'react'
import Link from 'next/link'
import LogoutBtn from './LogoutBtn'
import { authOptions } from '../lib/AuthOptions'
import { getServerSession } from 'next-auth'
import { FaHome } from 'react-icons/fa'

export default async function Header() {
  const session = await getServerSession(authOptions)
  return (
    <header className="w-full bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 text-white py-5 shadow-lg">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Landslide Records</h1>
              <p className="text-[11px] text-brand-200 font-medium tracking-wide">Disaster Inventory System</p>
            </div>
          </div>

          {session && (
            <div className="flex items-center gap-3">
              <Link
                href="/home"
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all duration-200"
              >
                <FaHome className="text-xs text-brand-200" />
                <span className="text-brand-100 text-xs font-medium">Home</span>
              </Link>
              <div className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-red-500/80 transition-all duration-200">
                <LogoutBtn />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
