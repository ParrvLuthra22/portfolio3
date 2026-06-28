export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  type: 'full-time' | 'internship' | 'freelance' | 'contract';
}

export const experiences: Experience[] = [
  {
    id: 1,
    company: 'Company Name',
    role: 'Software Engineer',
    period: '2024 — Present',
    location: 'Remote',
    type: 'full-time',
    description: [
      'Built scalable microservices handling 10M+ daily requests',
      'Led frontend redesign improving performance scores by 40%',
      'Mentored 3 junior engineers and drove team coding standards',
    ],
  },
  {
    id: 2,
    company: 'Another Company',
    role: 'Frontend Engineer Intern',
    period: '2023 — 2024',
    location: 'San Francisco, CA',
    type: 'internship',
    description: [
      'Developed React component library adopted across 5 product teams',
      'Optimized bundle size by 35% through code splitting and lazy loading',
      'Shipped 20+ features in an Agile environment',
    ],
  },
  {
    id: 3,
    company: 'Freelance',
    role: 'Full-Stack Developer',
    period: '2022 — 2023',
    location: 'Worldwide',
    type: 'freelance',
    description: [
      'Delivered 8+ web products for clients across design, fintech, and edtech',
      'Managed full project lifecycle from architecture to deployment',
    ],
  },
];

export const skills = {
  languages: ['TypeScript', 'Python', 'Rust', 'Go', 'SQL'],
  frontend: ['React', 'Next.js', 'Three.js', 'Framer Motion', 'GSAP', 'Tailwind'],
  backend: ['Node.js', 'Express', 'FastAPI', 'GraphQL', 'Prisma'],
  infra: ['AWS', 'Vercel', 'Docker', 'PostgreSQL', 'Redis', 'Supabase'],
  tools: ['Git', 'Figma', 'Linear', 'Notion'],
};
