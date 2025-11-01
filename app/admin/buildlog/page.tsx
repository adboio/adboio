"use client";

import { getBuildLogEntries, type BuildLogEntry } from '@/lib/supabase/queries';
import { BuildLogList } from '@/components/buildlog-list';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BuildLogAdminPage() {
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
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2 uppercase tracking-wider">
              Build Log Admin
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage build log entries
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/buildlog/new"
              className="px-4 py-2 border border-border bg-foreground text-background hover:bg-background hover:text-foreground transition-colors text-sm font-bold"
            >
              + New Entry
            </Link>
            <Link
              href="/"
              className="px-4 py-2 border border-border hover:bg-muted transition-colors text-sm"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </div>

      {/* Entries List */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground mb-4">No entries yet</p>
          <Link
            href="/admin/buildlog/new"
            className="inline-block px-4 py-2 border border-border hover:bg-muted transition-colors text-sm"
          >
            Create your first entry
          </Link>
        </div>
      ) : (
        <BuildLogList entries={entries} showThumbnails={true} showEditButton={true} />
      )}
    </main>
  );
}
