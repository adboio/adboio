import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "van log | adboio",
};

export default function VanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
