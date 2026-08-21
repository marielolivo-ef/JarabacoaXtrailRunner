import React from 'react';

export function Logo({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <img 
      src="/logo.jpg" 
      alt="Jarabacoa X-Trail Runner Logo" 
      className={`object-contain ${className}`}
    />
  );
}
