import { Icons } from "@/components/icons";

export type SocialLink = {
  name: string;
  url: string;
  icon: React.ElementType;
  navbar: boolean;
};

export const socialLinks: Record<string, SocialLink> = {
  github: {
    name: "GitHub",
    url: "https://github.com/adboio",
    icon: Icons.github,
    navbar: true,
  },
  linkedin: {
    name: "LinkedIn",
    url: "https://linkedin.com/in/adam-bowker",
    icon: Icons.linkedin,
    navbar: true,
  },
  x: {
    name: "X",
    url: "https://x.com/adboio",
    icon: Icons.x,
    navbar: true,
  },
  medium: {
    name: "Medium",
    url: "https://medium.com/@adboio",
    icon: Icons.x,
    navbar: true,
  },
};
