"use client";

import { FitnessSection } from "@/components/fitness-section";
import { CampervanSection } from "@/components/campervan-section";
import { BuildLogSection } from "@/components/buildlog-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { profile } from "@/data/profile";
import { work } from "@/data/work";
import { projects } from "@/data/projects";
import { socialLinks } from "@/data/social";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen font-mono">
      {/* Hero Section */}
      <section id="hero" className="mb-12">
        <div className="flex items-start gap-6 pb-8 border-b border-border">
          <Avatar className="size-20 rounded-none border border-border">
            <AvatarImage alt={profile.name} src={profile.avatarUrl} />
            <AvatarFallback>{profile.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{profile.name}</h1>
            <p className="text-sm text-muted-foreground mb-3">
              [{profile.description}]
            </p>
            <p className="text-sm leading-relaxed">{profile.summary}</p>
          </div>
        </div>
      </section>

      {/* Work Experience */}
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
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {job.start} - {job.end ?? "Present"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {job.title}
                  </p>
                  <p className="text-sm leading-relaxed">{job.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fitness Data */}
      <section id="fitness" className="mb-12">
        <FitnessSection />
      </section>

      {/* Build Log */}
      <section id="buildlog" className="mb-12">
        <BuildLogSection />
      </section>

      {/* Projects */}
      <section id="projects" className="mb-12">
        <h2 className="text-lg font-bold mb-6 uppercase tracking-wider">
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project.title}
              href={project.href || "#"}
              className="border border-border hover:border-foreground transition-colors"
            >
              {(project.image || project.video) && (
                <div className="aspect-video border-b border-border overflow-hidden">
                  {project.video && (
                    <video
                      src={project.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  )}
                  {project.image && !project.video && (
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={500}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold">{project.title}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {project.dates}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-3">
                  {project.description}
                </p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="text-muted-foreground">
                        [{tech}]
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mb-8">
        <div className="border-t border-border pt-8">
          <h2 className="text-lg font-bold mb-4 uppercase tracking-wider">
            Get in Touch
          </h2>
          <p className="text-sm leading-relaxed mb-4">
            i&apos;m always open to chatting about anything!{" "}
            <a
              href={`mailto:${profile.contact.email}`}
              className="underline hover:no-underline"
            >
              shoot me an email
            </a>{" "}
            or let&apos;s connect elsewhere:
          </p>
          <div className="flex gap-4 text-sm">
            {Object.entries(socialLinks).map(
              ([key, social]) =>
                social.navbar && (
                  <a
                    key={key}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    [{social.name}]
                  </a>
                ),
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
