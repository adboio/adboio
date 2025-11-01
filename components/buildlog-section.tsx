"use client";

import { useEffect, useState } from 'react';
import { getBuildLogEntries, type BuildLogEntry } from '@/lib/supabase/queries';
import Image from 'next/image';
import Link from 'next/link';

export function BuildLogSection() {
  const [entries, setEntries] = useState<BuildLogEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEntries() {
      const data = await getBuildLogEntries();
      setTotalCount(data.length);
      // Only show the 4 most recent entries
      setEntries(data.slice(0, 4));
      setIsLoading(false);
    }
    loadEntries();
  }, []);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-lg font-bold mb-6 uppercase tracking-wider">
          Campervan Log
        </h2>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-bold mb-6 uppercase tracking-wider">
          Campervan Log
        </h2>
        <p className="text-sm text-muted-foreground">No entries yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-2 uppercase tracking-wider">
        Campervan Log
      </h2>
      {totalCount > 4 && (
        <p className="text-sm text-muted-foreground mb-6">
          <Link
            href="/van"
            className="underline hover:no-underline"
          >
            [view all {totalCount} entries →]
          </Link>
        </p>
      )}

      {/* Grid of 4 latest entries */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {entries.map((entry) => {
          const firstImage = entry.build_images?.[0]?.path;

          // Format date without timezone conversion
          const formattedDate = entry.date ? (() => {
            const dateStr = entry.date.split('T')[0];
            const [year, month, day] = dateStr.split('-');
            const date = new Date(Number(year), Number(month) - 1, Number(day));
            return date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
          })() : null;

          return (
            <Link key={entry.id} href={`/van/${entry.id}`} className="group relative">
              <div className="border border-border overflow-hidden aspect-square">
                {firstImage ? (
                  <Image
                    src={firstImage}
                    alt={entry.title || 'Build log entry'}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 bg-muted">
                    <p className="text-xs text-center font-bold leading-tight">
                      {entry.title}
                    </p>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {entry.title}
              </p>
              {formattedDate && (
                <p className="text-xs text-muted-foreground">
                  {formattedDate}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
