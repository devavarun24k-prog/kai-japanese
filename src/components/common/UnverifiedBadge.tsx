// src/components/common/UnverifiedBadge.tsx
// Consistent badge shown whenever Telugu translations or pronunciations are unverified by a human linguist
import React from 'react';

export interface UnverifiedBadgeProps {
  isVerified?: boolean;
  label?: string;
  className?: string;
}

export const UnverifiedBadge: React.FC<UnverifiedBadgeProps> = ({
  isVerified = false,
  label = 'Unverified',
  className = ''
}) => {
  if (isVerified) return null;

  return (
    <span
      title="This translation or pronunciation is pending human review and has not yet been verified by a native linguist."
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-sans font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/80 tracking-wide select-none ${className}`}
    >
      {label}
    </span>
  );
};
