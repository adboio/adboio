"use client";

import { BuildLogEditor } from "@/components/buildlog-editor";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BuildLogNewPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to list page after successful creation
    router.push("/admin/buildlog");
  };

  return (
    <main className="flex flex-col min-h-screen font-mono">
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2 uppercase tracking-wider">
              New Build Log Entry
            </h1>
            <p className="text-sm text-muted-foreground">
              Create a new build log entry for the van project
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
      <BuildLogEditor onSuccess={handleSuccess} />
    </main>
  );
}
