"use client";

import { getBuildLogEntries, type BuildLogEntry } from '@/lib/supabase/queries';
import { BuildLogList } from '@/components/buildlog-list';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VanPage() {
  const [entries, setEntries] = useState<BuildLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      const data = await getBuildLogEntries();
      setEntries(data);
      setLoading(false);
    }

    fetchEntries();
  }, []);

  return (
    <main className="flex flex-col min-h-screen font-mono">
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-border">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block"
        >
          ← back to home
        </Link>
        <h1 className="text-2xl font-bold mb-2 uppercase tracking-wider">
          Campervan Build + Travel Log
        </h1>
        <p className="text-sm text-muted-foreground">
          build updates, trip reports, and tips & tricks for van building
        </p>
      </div>

      {/* Entries List */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No entries yet. Check back soon!</p>
        </div>
      ) : (
        <BuildLogList entries={entries} showThumbnails={true} />
      )}
    </main>
  );
}
