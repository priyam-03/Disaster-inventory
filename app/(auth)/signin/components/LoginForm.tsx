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
    <div className='space-y-6 flex flex-col items-center'>
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
        placeholder="••••••••"
        onKeyDown={handleKeyDown}
      />
      
      <div className="w-full lg:w-[30rem] flex justify-between items-center mt-2">
        <div className="flex items-center">
          <input id="remember" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-600">Remember me</label>
        </div>
       
      </div>
      
      <button
        onClick={login}
        disabled={loading}
        className='w-full lg:w-[30rem] py-3 px-10 bg-blue-600 hover:bg-blue-700 rounded-full text-white disabled:opacity-70 cursor-pointer transition-colors duration-200 mt-4 font-medium flex justify-center items-center'
      >
        {loading ? (
          <span className="mr-2 w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
        ) : null}
        {loading ? 'Signing in...' : 'Login'}
      </button>
    </div>  
  )
}