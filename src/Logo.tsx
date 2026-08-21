import React from 'react';
import { logoBase64 } from './assets/logoBase64';

export function Logo({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <img 
      src={logoBase64} 
      alt="Jarabacoa X-Trail Runner Logo" 
      className={`object-contain ${className}`}
    />
  );
}
