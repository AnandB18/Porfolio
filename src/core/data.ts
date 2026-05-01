import type { ContactLink, Experience, Project, CurrentlyItem, Education } from './types';

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
export const EDUCATION_HEADER = 'Education:';
export const RESUME_HEADER = 'Resume:';

export const ABOUT_PREVIEW = {
  imageAlt: 'Photo of Anand Bhat',
  title: 'WHOAMI',
  paragraphs: [
    'Hello, I am Anand Bhat! I am currently pursuing a BS in Computer Science at The George Washington University with a passion in systems programming and cybersecurity.',
    'Upcoming, I will be researching UAV anomaly detection at the Security and Systems Lab at GWU under the guidence of Dr. Mohan.',
    'Outside of school, I enjoy anything sports related, winding down with a good book, and learning new things from side projects.',
    'You can contact me via the links below. Thank you for visiting my portfolio!'
  ],
};

export const CURRENTLY_ITEMS: CurrentlyItem[] = [
  { label: 'Reading', title: 'Red Rising', subtitle: 'By: Pierce Brown', description: 'I have started to read a chapter or two before I go to sleep.  Picked up this book recently and I am already struggling to put it down.  I will definetly read the 5 other books in this series after I finish this book.', imageKey: 'reading-image', imageAlt: 'Red Rising Book Cover' },
  { label: 'Watching', title: 'Avatar: The Last Airbender (Live Action)', subtitle: 'Netflix Series', description: 'I got into animated films and shows this year and so I just finsihed rewatching the animated series.  Now I am looking forward to wathcing the live action sereis.', imageKey: 'watching-image', imageAlt: 'Avatar: The Last Airbender (Live Action) Poster' },
  { label: 'Learning', title: 'TUI/CLI Development', description: 'I have been learning about TUI/CLI app development.  I have  started by trying to implement my portfolio as a TUI/CLI app.', imageKey: 'learning-image', imageAlt: 'TUI/CLI Development' },
  { label: 'Building', title: 'Terminal Style Portfolio', description: 'I have been working on my portfolio for the past few weeks.  I have been learning about TUI/CLI app development.  I have  started by trying to implement my portfolio as a TUI/CLI app.', imageKey: 'building-image', imageAlt: 'Terminal Style Portfolio' },
  { label: 'Latest Commit', title: '...', subtitle: '...', description: '...', href: '...' },
];

export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://...', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://...', icon: 'github' },
  { label: 'Email', href: 'mailto:...' , icon: 'mail' },
];


export const PROJECTS: Project[] = [
  {
    id: 'portfolio',
    title: 'Terminal Portfolio',
    summary: 'Interactive terminal-inspired portfolio with command routing and animated preview panels.',
    stack: ['React', 'TypeScript', 'CSS'],
    imageKey: 'project-portfolio',
    imageAlt: 'Terminal Portfolio preview image',
    repoUrl: 'https://github.com/your-handle/terminal-portfolio',
  },
  {
    id: 'shell',
    title: 'Mini Shell',
    summary: 'Custom command-line shell with built-in commands, execution flow, and process handling.',
    stack: ['C', 'Linux', 'Systems Programming'],
    imageKey: 'project-shell',
    imageAlt: 'Mini shell project preview image',
    repoUrl: 'https://github.com/your-handle/mini-shell',
  },
  {
    id: 'gcal-planner',
    title: 'Task Manager App',
    summary: 'Planner app for organizing tasks and integrating schedules with a clear workflow.',
    stack: ['React', 'Firebase', 'API'],
    imageKey: 'project-planner',
    imageAlt: 'Task manager app preview image',
    repoUrl: 'https://github.com/your-handle/task-manager-app',
    liveUrl: 'https://example.com',
  },
];

export const EXPERIENCE: Experience[] = [
  {
    id: 'research-fellow',
    role: 'Research Fellow ',
    org: 'The George Washington University',
    period: 'May 2026 - Present',
    highlights: ['Built security tools for detecting if drones are compromised.', 'Worked on a project to detect if a drone is compromised by analyzing the drone\'s behavior and data.'],
  },
  {
    id: 'teaching-assistant-systems',
    role: 'Intro to Systems Programming Teaching Assistant',
    org: 'The George Washington University',
    period: 'June 2025 - December 2025',
    highlights: ['Taught students the basics of systems programming while also teaching basic C concepts and syntax.', 'Worked on a project to create a system programming language that is easy to learn and use.'],
  },
  {
    id: 'teaching-assistant-ads',
    role: 'Algorithms And Data Structures Teaching Assistant',
    org: 'The George Washington University',
    period: 'June 2024 - June 2025',
    highlights: ['Taught students the basics of algorithsm and data structures using Java', 'Worked on a project to create a data structures and algorithms library that is easy to learn and use.'],
  },
];

export const EDUCATION: Education[] = [
  {
    id: 'gw-bs-cs',
    school: 'The George Washington University',
    program: 'Bachelor of Science in Computer Science',
    period: 'expected graduation: May 2027',
    location: 'Washington, DC',
    gpa: '3.8',
    honors: ['Dean\'s List', 'President\'s List'],
    coursework: ['Data Structures', 'Algorithms', 'Operating Systems', 'Computer Architecture', 'Computer Networks', 'Database Systems', 'Software Engineering'],
    highlights: ['some highlights....', 'some more highlishts...', 'some more highlights...'],
  },
  {
    id: 'ucd-stdyabrd',
    school: 'University College Dublin',
    program: 'Study Abroad',
    period: 'January 2026 - May 2026',
    location: 'Dublin, Ireland',
    highlights: ['some highlights....', 'some more highlishts...', 'some more highlights...'],
  }
];

export const CONTACT: ContactLink[] = [
  { label: 'Email', value: 'your.email@example.com' },
  { label: 'GitHub', value: 'github.com/your-handle' },
  { label: 'LinkedIn', value: 'linkedin.com/in/your-handle' },
  { label: 'Resume', value: 'https://example.com/resume.pdf' },
];

