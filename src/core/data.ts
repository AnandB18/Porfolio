import type { ContactLink, Experience, Project, SkillGroup } from './types';

export const ASCII_HEADER: string[] = [
  '  ____             __  _____      ___      ',
  ' / __ \\____  _____/ /_/ __(_)____/ (_)___ _',
  '/ /_/ / __ \\/ ___/ __/ /_/ / ___/ / / __ `/',
  '/ ____/ /_/ / /  / /_/ __/ / /  / / / /_/ / ',
  '/_/    \\____/_/   \\__/_/ /_/_/  /_/_/\\__,_/',
];

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

export const SKILLS: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'C/C++'],
  },
  {
    label: 'Frontend',
    items: ['React', 'HTML/CSS', 'Responsive UI', 'Accessibility'],
  },
  {
    label: 'Tools',
    items: ['Git', 'Linux', 'Node.js', 'REST APIs'],
  },
];

export const CONTACT: ContactLink[] = [
  { label: 'Email', value: 'your.email@example.com' },
  { label: 'GitHub', value: 'github.com/your-handle' },
  { label: 'LinkedIn', value: 'linkedin.com/in/your-handle' },
];
