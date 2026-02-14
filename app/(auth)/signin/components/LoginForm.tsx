"use client"

import Input from '@/components/Input'
import { signIn, signOut } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export default function LoginForm() {
  useEffect(() => {
    signOut({
      redirect: false,
    });
  }, [])

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if(login?.ok){
        toast.success("Login successful!");
        window.location.assign("/home");
      }
      else if(login?.error){
        toast.error(login?.error);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      login();
    }
  }

  return (
    <div className='space-y-5 flex flex-col'>
      <Input
        label='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        placeholder="name@example.com"
        onKeyDown={handleKeyDown}
      />
      <Input
        label='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        type='password'
        placeholder="Enter your password"
        onKeyDown={handleKeyDown}
      />

      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer group">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          <label htmlFor="remember" className="text-sm text-surface-500 group-hover:text-surface-700 transition-colors cursor-pointer select-none">
            Remember me
          </label>
        </div>
      </div>

      <button
        onClick={login}
        disabled={loading}
        className={`w-full py-3 px-10 rounded-xl text-white font-semibold text-sm
          transition-all duration-300 mt-1 flex justify-center items-center gap-2
          ${loading
            ? 'bg-brand-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 hover:shadow-glow active:scale-[0.98]'
          }`}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </div>
  )
}
