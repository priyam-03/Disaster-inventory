"use client"

import { signOut } from 'next-auth/react';
import React from 'react'
import { FaSignOutAlt } from 'react-icons/fa';

export default function LogoutBtn() {
  return (
    <button
      onClick={() => signOut()}
      className='flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors cursor-pointer'
    >
      <FaSignOutAlt className="text-xs" />
      Logout
    </button>
  )
}
