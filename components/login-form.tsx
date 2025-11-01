"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/admin/buildlog");
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-border p-6 font-mono">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 uppercase tracking-wider">Login</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access admin
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-xs font-bold mb-2 uppercase tracking-wider">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-border bg-background focus:outline-none focus:border-foreground font-mono text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-bold mb-2 uppercase tracking-wider">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-border bg-background focus:outline-none focus:border-foreground font-mono text-sm"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 border border-red-500 p-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 border border-border bg-foreground text-background hover:bg-background hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold uppercase tracking-wider"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Site
          </Link>
        </div>
      </form>
    </div>
  );
}
