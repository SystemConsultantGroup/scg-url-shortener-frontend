'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { initMocks } = await import('./index');
      await initMocks();
      console.log('[MSW] Mocking enabled');
      setMswReady(true);
    };

    if (process.env.NODE_ENV === 'development') {
      init();
    } else {
      setMswReady(true);
    }
  }, []);

  if (!mswReady && process.env.NODE_ENV === 'development') {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
