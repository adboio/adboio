"use client";

import { BuildLogEditor } from '@/components/buildlog-editor';
import { getBuildLogEntry, type BuildLogEntry } from '@/lib/supabase/queries';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BuildLogEditPage() {
  const params = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<BuildLogEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntry() {
      if (!params.id || typeof params.id !== 'string') {
        setLoading(false);
        return;
      }

      const data = await getBuildLogEntry(params.id);
      setEntry(data);
      setLoading(false);
    }

    fetchEntry();
  }, [params.id]);

  const handleSuccess = () => {
    // Redirect to list page after successful update
    router.push('/admin/buildlog');
  };

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen font-mono">
        <div className="mb-12 pb-8 border-b border-border">
          <Link
            href="/admin/buildlog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to List
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!entry) {
    return (
      <main className="flex flex-col min-h-screen font-mono">
        <div className="mb-12 pb-8 border-b border-border">
          <Link
            href="/admin/buildlog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to List
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">Entry not found</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen font-mono">
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2 uppercase tracking-wider">
              Edit Build Log Entry
            </h1>
            <p className="text-sm text-muted-foreground">
              Editing: {entry.title}
            </p>
          </div>
          <Link
            href="/admin/buildlog"
            className="px-4 py-2 border border-border hover:bg-muted transition-colors text-sm"
          >
            ← Back to List
          </Link>
        </div>
      </div>

      {/* Editor */}
      <BuildLogEditor
        onSuccess={handleSuccess}
        existingEntry={entry}
        isEditMode={true}
      />
    </main>
  );
}
