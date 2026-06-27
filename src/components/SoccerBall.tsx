import React from 'react';

export const SoccerBall = ({ size = 24, className = "" }: { size?: number | string, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="12 6 16 9 14 14 10 14 8 9" />
    <line x1="12" y1="6" x2="12" y2="2" />
    <line x1="16" y1="9" x2="20.5" y2="6.5" />
    <line x1="14" y1="14" x2="17.5" y2="20.5" />
    <line x1="10" y1="14" x2="6.5" y2="20.5" />
    <line x1="8" y1="9" x2="3.5" y2="6.5" />
  </svg>
);
