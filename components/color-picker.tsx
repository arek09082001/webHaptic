"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export default function ColorPicker({
  label,
  value,
  onChange,
  className = '',
}: ColorPickerProps) {
  const t = useTranslations();
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wide">
          {label}
        </label>
      )}
      
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-20 border-2 border-border-light rounded-lg cursor-pointer shadow-md hover:border-magenta/50 transition"
        title={`${t('colorPicker.selectColor')} (${value})`}
      />
    </div>
  );
}
