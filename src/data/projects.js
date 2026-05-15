/** Curated portfolio projects (not pulled from GitHub). Edit freely. */
export const FEATURED_PROJECTS = [
  {
    id: "portfolio",
    name: "Personal Portfolio",
    description:
      "Production portfolio with themes, i18n (EN/RU/UZ), lazy-loaded AI assistant, and responsive UI built with React + Vite.",
    stack: ["React", "Vite", "CSS"],
    status: "Live",
    link: "https://matkarimovff.vercel.app",
  },
  {
    id: "fullstack",
    name: "Fullstack Web Platform",
    description:
      "End-to-end app: Django REST API, PostgreSQL, React frontend, auth and clean architecture focused on maintainability.",
    stack: ["Django", "React", "PostgreSQL"],
    status: "In progress",
    link: null,
  },
  {
    id: "api-docker",
    name: "API & DevOps Starter",
    description:
      "Backend service with Dockerized workflow, environment-based config, and deployment-ready structure for real teams.",
    stack: ["Python", "Docker", "Linux"],
    status: "Completed",
    link: null,
  },
  {
    id: "learning",
    name: "Learning Lab",
    description:
      "Sandbox for Next.js, TypeScript, and modern patterns — experiments that feed into production projects.",
    stack: ["Next.js", "TypeScript"],
    status: "Learning",
    link: null,
  },
];
