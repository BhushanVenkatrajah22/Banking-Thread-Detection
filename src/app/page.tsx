'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page immediately
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner loading */}
        <div className="w-8 h-8 rounded-full border-2 border-[#2563EB]/25 border-t-[#2563EB] animate-spin"></div>
        <span className="text-xs text-slate-500 font-medium">Redirecting to SecureMind Login...</span>
      </div>
    </div>
  );
}
