import {
  ABOUT_LINES,
  CONTACT,
  EDUCATION,
  EDUCATION_HEADER,
  EXPERIENCE,
  EXPERIENCE_HEADER,
  PROJECTS,
  PROJECTS_FOOTER,
  PROJECTS_HEADER,
  RESUME_HEADER,
} from './data';
import type { CommandDefinition } from './types';

// Central command registry used by help output, execution, and autocomplete.
export const COMMANDS: Record<string, CommandDefinition> = {
  help: {
    description: 'Show available commands',
    run: () => [
      'Available commands:',
      ...Object.entries(COMMANDS).map(([name, def]) => `- ${name}: ${def.description}`),
    ],
  },
  clear: {
    description: 'Clear terminal output',
    run: ({ clearHistory }) => {
      clearHistory();
      return [];
    },
  },
  whoami: {
    description: 'Learn about me',
    run: () => ABOUT_LINES,
  },
  about: {
    description: 'Alias for whoami',
    run: () => ABOUT_LINES,
  },
  projects: {
    description: 'List available projects',
    run: () => [
      PROJECTS_HEADER,
      ...PROJECTS.map((p) => `- ${p.id}: ${p.title}`),
      PROJECTS_FOOTER,
    ],
  },
  experience: {
    description: 'Show work experience',
    run: () => [
      EXPERIENCE_HEADER,
      ...EXPERIENCE.flatMap((item) => [
        `- ${item.role} | ${item.org} | ${item.period}`,
        ...item.highlights.map((point) => `  ${point}`),
      ]),
    ],
  },
  education: {
    description: 'Show education background',
    run: () => [
      EDUCATION_HEADER,
      ...EDUCATION.flatMap((item) => [
        `- ${item.program} | ${item.school} | ${item.period}`,
        ...(item.location ? [`  Location: ${item.location}`] : []),
        ...(item.gpa ? [`  GPA: ${item.gpa}`] : []),
        ...(item.honors?.length ? [`  Honors: ${item.honors.join(', ')}`] : []),
        ...(item.coursework?.length ? [`  Coursework: ${item.coursework.join(', ')}`] : []),
        ...(item.highlights ?? []).map((point) => `  ${point}`),
      ]),
    ],
  },
  resume: {
    description: 'Open my resume',
    run: () => {
      const resumeItem = CONTACT.find((item) => item.label.toLowerCase() === 'resume');
      const resumeValue = resumeItem?.value ?? 'Resume link coming soon.';
      return [RESUME_HEADER, `- ${resumeValue}`];
    },
  },
};

// Levenshtein distance for typo-aware command suggestions.
const getEditDistance = (a: string, b: string): number => {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) dp[i][0] = i;
  for (let j = 0; j < cols; j += 1) dp[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }

  return dp[a.length][b.length];
};

export const getCommandSuggestion = (input: string): string | null => {
  const commandNames = Object.keys(COMMANDS);
  // Prefer prefix matches so short partial input resolves naturally.
  const prefixMatch = commandNames.find((name) => name.startsWith(input));

  if (prefixMatch) return prefixMatch;

  let bestMatch: string | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const name of commandNames) {
    const score = getEditDistance(input, name);
    if (score < bestScore) {
      bestScore = score;
      bestMatch = name;
    }
  }

  return bestScore <= 2 ? bestMatch : null;
};
