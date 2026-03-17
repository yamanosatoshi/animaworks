import React from "react";
import Link from "next/link";

export const AuthHeader: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 flex items-center justify-center py-8">
      <Link href="/" aria-label="KON トップへ戻る">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shadow-lg">
            <span className="text-xs font-bold text-white">KON</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">KON</span>
        </div>
      </Link>
    </header>
  );
};
