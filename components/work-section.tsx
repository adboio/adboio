"use client";

import { useState } from "react";
import Image from "next/image";
import { work } from "@/data/work";

export function WorkSection() {
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());

  const toggleJob = (company: string) => {
    setExpandedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(company)) {
        next.delete(company);
      } else {
        next.add(company);
      }
      return next;
    });
  };

  return (
    <section id="work" className="mb-12">
      <h2 className="text-lg font-bold mb-6 uppercase tracking-wider">
        Work Experience
      </h2>
      <div className="space-y-6">
        {work.map((job) => (
          <div key={job.company} className="border-l-2 border-border pl-4">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-8 h-8 border border-border flex-shrink-0">
                <Image
                  src={job.logoUrl}
                  alt={job.company}
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-sm font-bold">
                      {job.company}
                      {job.badges &&
                        job.badges.map((badge, i) => (
                          <span
                            key={i}
                            className="ml-2 text-xs text-muted-foreground font-normal"
                          >
                            [{badge}]
                          </span>
                        ))}
                    </h3>
                    <button
                      onClick={() => toggleJob(job.company)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                    >
                      [{expandedJobs.has(job.company) ? "hide" : "show"}]
                    </button>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {job.start} - {job.end ?? "Present"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{job.title}</p>
                {expandedJobs.has(job.company) && (
                  <p className="text-sm leading-relaxed mt-1">
                    {job.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
