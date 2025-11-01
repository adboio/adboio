"use client";

import { type BuildLogEntry } from '@/lib/supabase/queries';
import Link from 'next/link';
import Image from 'next/image';

interface BuildLogListProps {
  entries: BuildLogEntry[];
  showThumbnails?: boolean;
  showEditButton?: boolean;
}

export function BuildLogList({ entries, showThumbnails = false, showEditButton = false }: BuildLogListProps) {
  const formatDate = (dateString: string) => {
    // Parse date string directly without timezone conversion
    const dateStr = dateString.split('T')[0];
    const [year, month, day] = dateStr.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        const firstImage = entry.build_images?.[0]?.path;

        return (
          <div
            key={entry.id}
            className="border border-border p-4 hover:border-foreground transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Thumbnail */}
              {showThumbnails && (
                <Link
                  href={`/van/${entry.id}`}
                  className="flex-shrink-0 w-24 h-24 border border-border overflow-hidden"
                >
                  {firstImage ? (
                    <Image
                      src={firstImage}
                      alt={entry.title || 'Build log entry'}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-xs text-muted-foreground">No image</span>
                    </div>
                  )}
                </Link>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold mb-1">{entry.title}</h3>
                {entry.date && (
                  <p className="text-xs text-muted-foreground mb-2">
                    {formatDate(entry.date)}
                  </p>
                )}
                {entry.build_images && entry.build_images.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {entry.build_images.length} image{entry.build_images.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <Link
                  href={`/van/${entry.id}`}
                  className="px-3 py-1 border border-border hover:bg-muted transition-colors text-xs"
                >
                  View
                </Link>
                {showEditButton && (
                  <Link
                    href={`/admin/buildlog/${entry.id}/edit`}
                    className="px-3 py-1 border border-border hover:bg-muted transition-colors text-xs"
                  >
                    Edit
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
