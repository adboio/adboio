import type { Metadata } from "next";
import { getBuildLogEntry } from "@/lib/supabase/queries";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const entryId = parseInt(id, 10);
  const entry =
    entryId && !isNaN(entryId) ? await getBuildLogEntry(entryId) : null;

  if (!entry) {
    return {
      title: "Build Log Not Found | Adam Bowker",
      description: "The requested build log entry could not be found.",
    };
  }

  return {
    title: `${entry.title} | van log | adboio`,
  };
}

export default function BuildLogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
