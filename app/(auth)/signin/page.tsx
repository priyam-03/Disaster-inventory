// app/login/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import React from 'react'
import LoginForm from './components/LoginForm'
import Link from 'next/link'

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-purple-200">
      <div className="p-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl w-full sm:w-3/4 lg:w-auto max-w-md mx-4 transition-transform duration-300 hover:scale-[1.01]">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to continue to your dashboard</p>
        </div>

        <LoginForm />

        {/* <div className="text-sm text-center text-gray-500 mt-8">
          Don’t have an account?{' '}
          <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            Register
          </Link>
        </div> */}
      </div>
    </div>
  )
}
