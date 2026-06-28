export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  demoUrl: string;
  githubUrl: string;
  year: string;
  category: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'Project Alpha',
    description: 'A full-stack web application with real-time collaboration features and AI-powered suggestions.',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'OpenAI'],
    image: '/projects/alpha.jpg',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/parrvluthra/project-alpha',
    year: '2024',
    category: 'Full Stack',
  },
  {
    id: 2,
    title: 'Project Beta',
    description: 'An immersive 3D experience built with WebGL, featuring procedural generation and physics simulation.',
    tags: ['Three.js', 'React', 'WebGL', 'GSAP'],
    image: '/projects/beta.jpg',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/parrvluthra/project-beta',
    year: '2024',
    category: 'Creative Dev',
  },
  {
    id: 3,
    title: 'Project Gamma',
    description: 'Mobile-first fintech dashboard with real-time data visualization and predictive analytics.',
    tags: ['React Native', 'D3.js', 'Node.js', 'PostgreSQL'],
    image: '/projects/gamma.jpg',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/parrvluthra/project-gamma',
    year: '2023',
    category: 'Mobile',
  },
  {
    id: 4,
    title: 'Project Delta',
    description: 'Open-source developer tooling CLI that automates repetitive workflows and boosts DX.',
    tags: ['Rust', 'Node.js', 'CLI', 'Open Source'],
    image: '/projects/delta.jpg',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/parrvluthra/project-delta',
    year: '2023',
    category: 'Tooling',
  },
  {
    id: 5,
    title: 'Project Epsilon',
    description: 'E-commerce platform with headless architecture, edge-optimized delivery, and personalization engine.',
    tags: ['Next.js', 'Shopify', 'GraphQL', 'Vercel'],
    image: '/projects/epsilon.jpg',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/parrvluthra/project-epsilon',
    year: '2023',
    category: 'E-Commerce',
  },
];
