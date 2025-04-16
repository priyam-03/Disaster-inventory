// /app/page.tsx or /app/dashboard/page.tsx

import { redirect } from 'next/navigation'
import { authOptions } from '../../lib/AuthOptions'
import { getServerSession } from 'next-auth'
import Link from 'next/link'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/signin')
  }

  return (
    <main className="h-[120vh] bg-gray-100 flex flex-col items-center justify-center gap-8 px-4 py-10">
      <div className="max-w-4xl w-full">
        {/* Welcome Message */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, <span className="text-blue-600">{session.user?.email}</span> 🎉
          </h1>
          <p className="text-gray-500 mt-2">You’re logged into the protected dashboard.</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/clusters">
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition duration-300 cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-800">View the map in clustered vision</h2>
              <p className="text-gray-500">Go to Clustered Vision</p>
            </div>
          </Link>

          <Link href="/locations">
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition duration-300 cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-800">View All Locations</h2>
              <p className="text-gray-500">Browse all available places</p>
            </div>
          </Link>

          <Link href="/admin">
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition duration-300 cursor-pointer">
              <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
              <p className="text-gray-500">Manage your application</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}
