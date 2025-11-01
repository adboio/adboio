export type Work = {
  company: string;
  title: string;
  logoUrl: string;
  start: string;
  end?: string;
  href?: string;
  description: string;
  badges?: readonly string[];
};

export const work: readonly Work[] = [
  {
    company: "Amazon",
    title: "Software Engineer II",
    logoUrl: "/amazon.png",
    start: "Apr 2022",
    end: "Nov 2025",
    description: "built a cool new marketplace (NDA rip), bunch of ML/data pipelines, agentic testing framework, and human-in-the-loop system for customer service. mentored several junior engs / interns / non-SDE folks. left to get back into the startup scene."
  },
  {
    company: "Tukios",
    title: "Software Engineer",
    logoUrl: "/tukios.jpeg",
    start: "Nov 2020",
    end: "Apr 2022",
    description: 'responsible for a large part of Tukios\' website product. built an automated web scraper for obituaries to growth-hack / simplify onboarding, plus a custom website builder/launcher/cms platform. tukios is almost the #1 funeral home website provider now 🤫',
  },
  {
    company: "Imagicode",
    badges: ['acquired 🎉'],
    title: "Co-founder & Instructor",
    logoUrl: "/imagicode.jpg",
    start: "Jan 2019",
    end: "Jun 2020",
    description: 'worked at a coding camp -> boss left the country and went dark -> so we stole his clients. taught kids to code in summer camps & after-school clubs til covid hit, then acquired by a local STEM school in June 2020 to expand their direct-to-school offerings.'
  },
  {
    company: "Heller PR",
    title: "Software Engineer - Freelance",
    logoUrl: "/heller-pr.jpg",
    start: "Nov 2018",
    end: "Nov 2024",
    description: 'built creative software for lots of different clients. fun: ended up co-founding a nonprofit and built a cool web VR experience to accompany an in-person event. less fun, more impressive: a complete practice mgmt system for an adult ADHD clinic resulting in +100% prospective patients/year and +25% new patients/year with 50% less staff.'
  },
];
