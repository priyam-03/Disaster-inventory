// app/login/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/AuthOptions'
import { redirect } from 'next/navigation'
import React from 'react'
import LoginForm from './components/LoginForm'

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-surface-100 via-brand-50 to-surface-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-200/30 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-300/20 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-100/20 rounded-full blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md mx-4 animate-[slideUp_0.5s_ease-out]">
        {/* Top gradient accent */}
        <div className="h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-700 rounded-t-2xl" />

        <div className="p-8 sm:p-10 bg-white/85 backdrop-blur-xl rounded-b-2xl shadow-glass-lg border border-white/50">
          {/* Logo / Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-surface-800 tracking-tight">Welcome Back</h1>
            <p className="text-surface-400 text-sm mt-1.5">Sign in to the Disaster Inventory System</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
