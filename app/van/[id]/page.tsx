"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBuildLogEntry, type BuildLogEntry } from "@/lib/supabase/queries";
import { ImageLightbox } from "@/components/image-lightbox";
import Image from "next/image";
import Link from "next/link";

export default function BuildLogEntryPage() {
  const params = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<BuildLogEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function fetchEntry() {
      if (!params.id || typeof params.id !== "string") {
        setLoading(false);
        return;
      }

      const entryId = parseInt(params.id, 10);
      if (isNaN(entryId)) {
        setLoading(false);
        return;
      }

      const data = await getBuildLogEntry(entryId);
      setEntry(data);
      setLoading(false);
    }

    fetchEntry();
  }, [params.id]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen font-mono">
        <div className="mb-12 pb-8 border-b border-border">
          <Link
            href="/van"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← all logs
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">loading...</p>
      </main>
    );
  }

  if (!entry) {
    return (
      <main className="flex flex-col min-h-screen font-mono">
        <div className="mb-12 pb-8 border-b border-border">
          <Link
            href="/van"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← all logs
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">404, ruh-roh</p>
      </main>
    );
  }

  const images = entry.build_images.map((img) => img.path);

  return (
    <main className="flex flex-col min-h-screen font-mono">
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-border">
        <Link
          href="/van"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block"
        >
          ← all logs
        </Link>
        <h1 className="text-2xl font-bold mb-2">{entry.title}</h1>
        {entry.date && (
          <p className="text-sm text-muted-foreground mb-3">
            {(() => {
              // Parse date string directly without timezone conversion
              const dateStr = entry.date.split("T")[0];
              const [year, month, day] = dateStr.split("-");
              const date = new Date(
                Number(year),
                Number(month) - 1,
                Number(day),
              );
              return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
            })()}
          </p>
        )}
        {/* Social Links */}
        {entry.build_links && entry.build_links.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {entry.build_links.map((link, index) => (
              <a
                key={index}
                href={link.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                [{link.platform}]
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images
              .map((img) => img || "")
              .map((image, index) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="border border-border overflow-hidden aspect-square relative hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <Image
                    src={image}
                    alt={`${entry.title} - Image ${index + 1}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mb-12">
        <div
          className="prose prose-sm font-mono max-w-none whitespace-pre-wrap [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:font-bold [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: entry.content || "<p></p>" }}
        />
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={images.map((img) => img || "")}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </main>
  );
}
