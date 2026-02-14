"use client"

import Input from '@/components/Input';
import axios from 'axios';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export default function RegisterForm() {

    useEffect(() => {
      signOut({
        redirect: false,
      });
    }, []);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const register = async () => {
      if (!email || !password) {
        toast.error("Please fill in all fields");
        return;
      }
      setLoading(true);
      try{
        await axios.post("/api/register", {
          email, password
        });

        toast.success("Successfully registered");

        router.push("/signin");
      } catch(err: any){
        console.log(err);
        toast.error(err?.response?.data)
      } finally{
        setLoading(false);
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        register();
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
          placeholder="Create a password"
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={register}
          disabled={loading}
          className={`w-full py-3 px-10 rounded-xl text-white font-semibold text-sm
            transition-all duration-300 mt-2 flex justify-center items-center gap-2
            ${loading
              ? 'bg-brand-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 hover:shadow-glow active:scale-[0.98]'
            }`}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    )
}
