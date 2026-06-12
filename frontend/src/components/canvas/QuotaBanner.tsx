"use client";

import Link from 'next/link';

interface QuotaBannerProps {
  currentCount: number;
  maxAllowed: number;
  canCreate: boolean;
}

export default function QuotaBanner({ currentCount, maxAllowed, canCreate }: QuotaBannerProps) {
  const percentage = Math.min((currentCount / maxAllowed) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = !canCreate;

  return (
    <div className="px-4 py-3 border-t border-outline-variant">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-label-caps text-outline uppercase tracking-wider">
          Canvas Pages
        </span>
        <span className={`text-[10px] font-label-caps font-bold ${
          isAtLimit ? 'text-error' : isNearLimit ? 'text-primary' : 'text-outline'
        }`}>
          {currentCount}/{maxAllowed}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className={`quota-bar-fill h-full rounded-full ${
            isAtLimit
              ? 'bg-error'
              : isNearLimit
              ? 'bg-primary'
              : 'bg-primary/60'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isAtLimit && maxAllowed <= 2 && (
        <Link
          href="/pricing"
          className="mt-2 flex items-center gap-1 text-[10px] font-label-caps text-primary hover:text-primary-fixed transition-colors"
        >
          <span className="material-symbols-outlined text-xs">upgrade</span>
          UPGRADE FOR MORE PAGES
        </Link>
      )}
    </div>
  );
}
