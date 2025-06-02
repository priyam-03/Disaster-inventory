import React from 'react'
import LogoutBtn from './LogoutBtn'
import { authOptions } from '../lib/AuthOptions'
import { getServerSession } from 'next-auth'
export default async function Header() {
  const session = await getServerSession(authOptions)
  return (
    
     
    <header className="w-full bg-blue-600 text-white py-6">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between">
        {/* Centered Title with absolute center alignment */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-4xl font-bold text-center">Landslide Records Map</h1>
        </div>
  
        {/* Logout Button aligned right */}
        {session && (
          <div className="ml-auto">
            <div className="text-white px-4 py-2 rounded hover:bg-red-600">
              <LogoutBtn />
            </div>
          </div>
        )}
      </div>
    </div>
  </header>
  
  )
}
