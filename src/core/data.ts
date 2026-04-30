import type { ContactLink, Experience, Project, CurrentlyItem } from './types';

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

export const PREVIEW_DEFAULT_NAME = 'Anand Bhat';
export const PREVIEW_DEFAULT_ROLE = 'Computer Science Student @ George Washington University';
export const PREVIEW_DEFAULT_TAGLINE = 'Focused on systems, cybersecurity, and practical software engineering.';
export const PREVIEW_DEFAULT_COMMANDS = 'Try: whoami, experience, or projects to learn more about me.';

export const PROJECTS_HEADER = 'Projects:';
export const PROJECTS_FOOTER = 'Project details panel wiring comes next.';
export const EXPERIENCE_HEADER = 'Experience:';
export const CONTACT_HEADER = 'Contact:';

export const ABOUT_PREVIEW = {
  imageAlt: 'Photo of Anand Bhat',
  title: 'WHOAMI',
  paragraphs: [
    'I am ...',
    'Outside of work ...',
    'You can connect with me below.',
  ],
};

export const CURRENTLY_ITEMS: CurrentlyItem[] = [
  { label: 'Reading', title: 'Red Rising', subtitle: 'By: Pierce Brown', description: '...', imageKey: 'reading-image', imageAlt: 'Red Rising Book Cover' },
  { label: 'Watching', title: 'Avatar: The Last Airbender (Live Action)', subtitle: 'Netflix Series', description: '...', imageKey: 'watching-image', imageAlt: 'Avatar: The Last Airbender (Live Action) Poster' },
  { label: 'Learning', title: 'TUI/CLI Development', description: '...' },
  { label: 'Building', title: 'Terminal Style Portfolio', description: '...' },
  { label: 'Latest Commit', title: '...', subtitle: '...', description: '...', href: '...' },
];
export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://...', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://...', icon: 'github' },
  { label: 'Email', href: 'mailto:...' , icon: 'mail' },
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

export const CONTACT: ContactLink[] = [
  { label: 'Email', value: 'your.email@example.com' },
  { label: 'GitHub', value: 'github.com/your-handle' },
  { label: 'LinkedIn', value: 'linkedin.com/in/your-handle' },
];

