import React, { ChangeEvent, useState } from 'react'

interface InputProps {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: string;
  label: string;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function Input({
  value,
  onChange,
  disabled,
  type = "text",
  label,
  placeholder,
  onKeyDown
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || (value && value.length > 0);

  return (
    <div className="relative w-full group">
      {/* Animated background glow */}
      <div className={`absolute -inset-0.5 rounded-xl transition-all duration-300 opacity-0 blur-sm
        ${isFocused ? 'opacity-100 bg-gradient-to-r from-brand-400/30 to-brand-600/30' : 'group-hover:opacity-50 bg-brand-200/20'}`}
      />

      <div className="relative">
        <input
          value={value}
          onChange={onChange}
          disabled={disabled}
          type={type}
          placeholder={isActive ? placeholder : ''}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 pt-5 pb-2.5 text-sm text-surface-800 bg-white rounded-xl
            border-2 outline-none transition-all duration-300
            disabled:bg-surface-100 disabled:text-surface-400 disabled:cursor-not-allowed
            ${isFocused
              ? 'border-brand-500 shadow-[0_0_0_3px_rgba(99,102,241,0.12)]'
              : 'border-surface-200 hover:border-surface-300'
            }`}
        />

        {/* Floating label */}
        <label className={`absolute left-4 transition-all duration-300 pointer-events-none font-medium
          ${isActive
            ? 'top-1.5 text-[11px] tracking-wide ' + (isFocused ? 'text-brand-600' : 'text-surface-400')
            : 'top-1/2 -translate-y-1/2 text-sm text-surface-400'
          }`}
        >
          {label}
        </label>

        {/* Active indicator line */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-brand-400 to-brand-600 rounded-full
          transition-all duration-300 ${isFocused ? 'w-[calc(100%-24px)]' : 'w-0'}`}
        />
      </div>
    </div>
  )
}
