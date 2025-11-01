export type Project = {
  title: string;
  href?: string;
  dates: string;
  active?: boolean;
  description: string;
  technologies: readonly string[];
  image?: string;
  video?: string;
};

export const projects: readonly Project[] = [
  {
    title: "tinycounter [coming soon]",
    dates: "Fall 2025",
    active: true,
    description: "a tiny, deceptively-simple app for counting stuff.",
    technologies: [],
    image: "/tinycounter-banner.png",
  },
  {
    title: "CreatorCookbooks",
    href: "https://www.creatorcookbooks.com",
    dates: "Fall 2025",
    active: true,
    description: "the easiest way for creators to make and sell a cookbook.",
    technologies: [],
    image: "/cc-banner.jpg",
  },
  {
    title: "VibeClinic",
    href: "https://vibeclinic.io",
    dates: "Fall 2025",
    active: true,
    description: "your vibe-coded app is broken, let us help you fix it.",
    technologies: [],
    image: "/vibeclinic-og.png",
  },
  {
    title: "Forkfile",
    href: "https://getforkfile.com",
    dates: "Fall 2024",
    active: true,
    description:
      "iOS app to solve one of my biggest (small) problems. share a recipe video to forkfile, get an actually-usable recipe.",
    technologies: [],
    image: "/forkfile-banner.jpg",
  },
  {
    title: "FirstClassMeme",
    href: "https://www.firstclassmeme.com",
    dates: "April 2025",
    active: true,
    description: "send a customized meme in the actual physical mail",
    technologies: [],
    image: "/fcm.png",
  },
];
