import React from 'react'
import { FaMapMarkerAlt, FaGithub, FaEnvelope } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="w-full bg-surface-900 text-surface-300 mt-auto overflow-hidden relative">
      {/* Top accent line */}
      <div className="h-[2px] bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600" />

      <div className="container mx-auto px-6 max-w-7xl py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-600/20 rounded-lg border border-brand-500/20">
              <FaMapMarkerAlt className="text-brand-400 text-sm" />
            </div>
            <div>
              <p className="text-sm font-semibold text-surface-100 tracking-tight">
                Landslide Records
              </p>
              <p className="text-[11px] text-surface-500">
                Disaster Inventory Mapping System
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5">
            <a
              href="mailto:contact@landsliderecords.org"
              className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-brand-300 transition-colors duration-200"
            >
              <FaEnvelope className="text-[10px]" />
              Contact
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-brand-300 transition-colors duration-200"
            >
              <FaGithub className="text-[10px]" />
              GitHub
            </a>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-brand-500" />
            <p className="text-xs text-surface-500">
              &copy; {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
