import type { ContactLink, Experience, Project } from './types';

export const ASCII_HEADER: string[] = [
  '  ____             __  _____      ___      ',
  ' / __ \\____  _____/ /_/ __(_)____/ (_)___ _',
  '/ /_/ / __ \\/ ___/ __/ /_/ / ___/ / / __ `/',
  '/ ____/ /_/ / /  / /_/ __/ / /  / / / /_/ / ',
  '/_/    \\____/_/   \\__/_/ /_/_/  /_/_/\\__,_/',
];

export const ABOUT_LINES: string[] = [
  'I am Anand...',
  'This portfolio is a terminal-inspired interface.',
  'Try: projects, experience, contact',
];

export const PROJECTS_HEADER = 'Projects:';
export const PROJECTS_FOOTER = 'Project details panel wiring comes next.';
export const EXPERIENCE_HEADER = 'Experience:';
export const CONTACT_HEADER = 'Contact:';

export const PROJECTS: Project[] = [
  { id: 'portfolio', title: 'Terminal Portfolio' },
  { id: 'shell', title: 'Mini Shell' },
  { id: 'gcal-planner', title: 'Task Manager App' },
];

export const EXPERIENCE: Experience[] = [
  {
    id: 'software-intern',
    role: 'Software Engineering Intern',
    org: 'Your Company',
    period: 'Summer 2025',
    highlights: ['Built internal tools and shipped production-facing updates.'],
  },
];

export const CONTACT: ContactLink[] = [
  { label: 'Email', value: 'your.email@example.com' },
  { label: 'GitHub', value: 'github.com/your-handle' },
  { label: 'LinkedIn', value: 'linkedin.com/in/your-handle' },
];
