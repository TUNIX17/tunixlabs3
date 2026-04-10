'use client';

import { useState, useEffect } from 'react';

/**
 * Computes a human-readable uptime string like "1y 10m"
 * from an ISO start date. Updates every 60 seconds.
 * SSR-safe: returns "" on the server.
 */
export function useUptime(startDateISO: string): string {
  const [uptime, setUptime] = useState('');

  useEffect(() => {
    function compute(): string {
      const start = new Date(startDateISO);
      const now = new Date();

      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      if (years > 0 && months > 0) return `${years}y ${String(months).padStart(2, '0')}m`;
      if (years > 0) return `${years}y 00m`;
      return `${months}m`;
    }

    setUptime(compute());

    const interval = setInterval(() => {
      setUptime(compute());
    }, 60_000);

    return () => clearInterval(interval);
  }, [startDateISO]);

  return uptime;
}
