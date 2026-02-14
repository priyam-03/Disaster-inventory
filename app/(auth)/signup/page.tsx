import React from 'react'
import RegisterForm from './components/RegisterForm'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-surface-100 via-brand-50 to-surface-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-200/30 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-300/20 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_reverse]" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md mx-4 animate-[slideUp_0.5s_ease-out]">
        <div className="h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-700 rounded-t-2xl" />

        <div className="p-8 sm:p-10 bg-white/85 backdrop-blur-xl rounded-b-2xl shadow-glass-lg border border-white/50">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-surface-800 tracking-tight">Create Account</h1>
            <p className="text-surface-400 text-sm mt-1.5">Register for the Disaster Inventory System</p>
          </div>

          <RegisterForm />

          <div className="text-sm text-center text-surface-400 mt-6 pt-6 border-t border-surface-100">
            Already have an account?{' '}
            <Link href="/signin" className="font-semibold text-brand-600 hover:text-brand-800 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
