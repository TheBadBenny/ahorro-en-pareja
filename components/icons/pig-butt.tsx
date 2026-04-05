"use client";

export function PigButtIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left cheek */}
      <ellipse cx="38" cy="48" rx="28" ry="30" fill="#FFB7C5" />
      {/* Right cheek */}
      <ellipse cx="62" cy="48" rx="28" ry="30" fill="#FFB7C5" />
      {/* Darker overlap / crack line */}
      <path
        d="M50 25 Q48 48 50 72"
        stroke="#F0A0B0"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Left highlight */}
      <ellipse cx="32" cy="40" rx="10" ry="8" fill="#FFD1DC" opacity="0.6" />
      {/* Right highlight */}
      <ellipse cx="68" cy="40" rx="10" ry="8" fill="#FFD1DC" opacity="0.6" />
      {/* Curly tail */}
      <path
        d="M50 20 Q58 8 54 2 Q48 -2 44 6 Q40 14 50 20"
        stroke="#FFB0C0"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left leg */}
      <rect x="30" y="72" width="10" height="14" rx="4" fill="#FFAABB" />
      <rect x="30" y="82" width="10" height="5" rx="2" fill="#F09AAA" />
      {/* Right leg */}
      <rect x="60" y="72" width="10" height="14" rx="4" fill="#FFAABB" />
      <rect x="60" y="82" width="10" height="5" rx="2" fill="#F09AAA" />
    </svg>
  );
}
