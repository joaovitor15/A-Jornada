import React from 'react';

interface JornadaLogoProps {
  className?: string;
  themed?: boolean; // If true, it follows Material You monochromatic style in dark mode
}

export default function JornadaLogo({ className = "w-8 h-8", themed = true }: JornadaLogoProps) {
  return (
    <div className={`${className} relative`}>
      <svg viewBox="0 0 512 512" className="w-full h-full drop-shadow-sm transition-all duration-500">
        <defs>
          {/* Default Gradients */}
          <linearGradient id="blueGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
          <linearGradient id="orangeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C2410C" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#FDBA74" />
          </linearGradient>
          
          {/* Material You Themed Colors (Dark Mode) */}
          <linearGradient id="themedGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D1E4FF" />
            <stop offset="100%" stopColor="#D1E4FF" />
          </linearGradient>
        </defs>

        <g className={`${themed ? 'dark:fill-[#D1E4FF] dark:stroke-[#D1E4FF]' : ''}`}>
          {/* Top Left Swoosh */}
          <path 
            d="M 120 280 A 180 180 0 0 1 340 100" 
            fill="none" 
            stroke={themed ? "currentColor" : "url(#orangeGrad)"} 
            strokeWidth="40" 
            strokeLinecap="round"
            className={`${themed ? 'text-current dark:text-[#D1E4FF] fill-none' : ''}`}
            style={{ 
               stroke: themed ? undefined : "url(#orangeGrad)",
               color: themed ? "inherit" : undefined
            }}
          />

          {/* Bottom to Right Blue Swoosh with Arrow */}
          <path 
            d="M 140 350 A 180 180 0 0 0 420 256 A 180 180 0 0 0 380 130" 
            fill="none" 
            stroke={themed ? "currentColor" : "url(#blueGrad)"} 
            strokeWidth="40" 
            strokeLinecap="round"
            className={`${themed ? 'text-current dark:text-[#D1E4FF] fill-none' : ''}`}
            style={{ 
               stroke: themed ? undefined : "url(#blueGrad)",
               color: themed ? "inherit" : undefined
            }}
          />
          
          {/* Arrow Head */}
          <path 
            d="M 390 90 L 330 155 L 430 145 Z" 
            className={`${themed ? 'fill-current dark:fill-[#D1E4FF]' : ''}`}
            style={{ 
               fill: themed ? "currentColor" : "url(#blueGrad)"
            }}
          />

          {/* Bars */}
          <rect x="180" y="270" width="40" height="90" rx="12" 
            className={`${themed ? 'fill-current dark:fill-[#D1E4FF]' : ''}`}
            style={{ fill: themed ? "currentColor" : "url(#orangeGrad)" }}
          />
          <rect x="236" y="210" width="40" height="150" rx="12" 
            className={`${themed ? 'fill-current dark:fill-[#D1E4FF]' : ''}`}
            style={{ fill: themed ? "currentColor" : "url(#orangeGrad)" }}
          />
          <rect x="292" y="150" width="40" height="210" rx="12" 
            className={`${themed ? 'fill-current dark:fill-[#D1E4FF]' : ''}`}
            style={{ fill: themed ? "currentColor" : "url(#orangeGrad)" }}
          />
        </g>
      </svg>
    </div>
  );
}
