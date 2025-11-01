import { campervanData } from "@/data/campervan";
import Image from "next/image";

export function CampervanSection() {
  const { highlights, instagramLink } = campervanData;

  return (
    <>
      <h2 className="text-lg font-bold mb-6 uppercase tracking-wider">
        Campervan Build
      </h2>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {highlights.map((highlight, index) => (
          <div key={index} className="group relative">
            {highlight.link ? (
              <a
                href={highlight.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="border border-border overflow-hidden aspect-square">
                  <Image
                    src={highlight.image}
                    alt={highlight.caption}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {highlight.caption}
                </p>
              </a>
            ) : (
              <>
                <div className="border border-border overflow-hidden aspect-square">
                  <Image
                    src={highlight.image}
                    alt={highlight.caption}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {highlight.caption}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Instagram Link */}
      <a
        href={instagramLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        [follow the build on ig →]
      </a>
    </>
  );
}
