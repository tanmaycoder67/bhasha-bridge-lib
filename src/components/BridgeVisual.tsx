import { useState, useEffect } from 'react';

export function BridgeVisual({ className = '', animate = false }: { className?: string; animate?: boolean }) {
  const [mounted, setMounted] = useState(!animate);
  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setMounted(true), 100);
      return () => clearTimeout(t);
    }
  }, [animate]);

  return (
    <svg viewBox="0 0 400 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bridgeGrad" x1="0" y1="0" x2="400" y2="0">
          <stop offset="0%" stopColor="#1A1F4A" />
          <stop offset="50%" stopColor="#E89B2F" />
          <stop offset="100%" stopColor="#4A8A5B" />
        </linearGradient>
        <linearGradient id="leftGrad" x1="0" y1="0" x2="0" y2="100">
          <stop offset="0%" stopColor="#2D3565" />
          <stop offset="100%" stopColor="#1A1F4A" />
        </linearGradient>
        <linearGradient id="rightGrad" x1="0" y1="0" x2="0" y2="100">
          <stop offset="0%" stopColor="#7BB589" />
          <stop offset="100%" stopColor="#4A8A5B" />
        </linearGradient>
      </defs>

      {/* Left pillar - School */}
      <g style={{ transition: 'all 0.6s ease', opacity: mounted ? 1 : 0, transform: mounted ? 'translate(0,0)' : 'translate(-10px,0)' }}>
        <rect x="30" y="50" width="80" height="120" rx="12" fill="url(#leftGrad)" />
        <rect x="30" y="50" width="80" height="120" rx="12" fill="rgba(255,255,255,0.05)" />
        <text x="70" y="95" textAnchor="middle" fill="#F5C66B" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans">SCHOOL</text>
        <text x="70" y="115" textAnchor="middle" fill="white" fontSize="20" fontWeight="700" fontFamily="Noto Sans Devanagari">किताब</text>
        <text x="70" y="135" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Textbook</text>
      </g>

      {/* Right pillar - Home */}
      <g style={{ transition: 'all 0.6s ease 0.15s', opacity: mounted ? 1 : 0, transform: mounted ? 'translate(0,0)' : 'translate(10px,0)' }}>
        <rect x="290" y="50" width="80" height="120" rx="12" fill="url(#rightGrad)" />
        <rect x="290" y="50" width="80" height="120" rx="12" fill="rgba(255,255,255,0.05)" />
        <text x="330" y="95" textAnchor="middle" fill="#E89B2F" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans">HOME</text>
        <text x="330" y="115" textAnchor="middle" fill="white" fontSize="20" fontWeight="700" fontFamily="Noto Sans Devanagari">घर</text>
        <text x="330" y="135" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">Mother Tongue</text>
      </g>

      {/* Bridge deck */}
      <path
        d="M 110 80 Q 200 40 290 80"
        stroke="url(#bridgeGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        style={{
          strokeDasharray: 300,
          strokeDashoffset: mounted ? 0 : 300,
          transition: 'stroke-dashoffset 1s ease 0.3s',
        }}
      />

      {/* Bridge suspension cables */}
      {[140, 175, 200, 225, 260].map((x, i) => {
        const y = 80 - Math.sin((x - 110) / 180 * Math.PI) * 40;
        return (
          <line
            key={x}
            x1={x}
            y1={y}
            x2={x}
            y2={80}
            stroke="url(#bridgeGrad)"
            strokeWidth="1.5"
            opacity={mounted ? 0.4 : 0}
            style={{ transition: `opacity 0.3s ease ${0.5 + i * 0.08}s` }}
          />
        );
      })}

      {/* Floating particles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx={120 + i * 35}
          cy={70 - Math.sin(i) * 15}
          r="2.5"
          fill={i % 2 === 0 ? '#E89B2F' : '#4A8A5B'}
          opacity={mounted ? 0.6 : 0}
          style={{
            transition: `opacity 0.5s ease ${0.6 + i * 0.1}s`,
            animation: mounted ? `float ${3 + i * 0.5}s ease-in-out infinite` : 'none',
          }}
        />
      ))}

      {/* Center medallion */}
      <g style={{ transition: 'all 0.5s ease 0.8s', opacity: mounted ? 1 : 0, transform: mounted ? 'scale(1)' : 'scale(0.5)' }}>
        <circle cx="200" cy="55" r="14" fill="#FAF6EF" stroke="#E89B2F" strokeWidth="2" />
        <text x="200" y="60" textAnchor="middle" fill="#E89B2F" fontSize="14" fontWeight="800">B</text>
      </g>
    </svg>
  );
}
