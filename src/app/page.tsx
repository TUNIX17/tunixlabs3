'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/inicio');
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <p className="text-lg text-gray-500">Redirigiendo a inicio...</p>
      </div>
    </div>
  );
} 