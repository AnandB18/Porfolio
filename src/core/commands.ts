import { CONTACT, EXPERIENCE, PROJECTS, SKILLS } from './data';
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
    run: () => [
      'I am Anand...',
      'This portfolio is a terminal-inspired interface.',
      'Try: projects, experience, skills, contact',
    ],
  },
  about: {
    description: 'Alias for whoami',
    run: () => [
      'I am Anand...',
      'This portfolio is a terminal-inspired interface.',
      'Try: projects, experience, skills, contact',
    ],
  },
  projects: {
    description: 'List available projects',
    run: () => [
      'Projects:',
      ...PROJECTS.map((p) => `- ${p.id}: ${p.title}`),
      'Project details panel wiring comes next.',
    ],
  },
  experience: {
    description: 'Show work experience',
    run: () => [
      'Experience:',
      ...EXPERIENCE.flatMap((item) => [
        `- ${item.role} | ${item.org} | ${item.period}`,
        ...item.highlights.map((point) => `  ${point}`),
      ]),
    ],
  },
  skills: {
    description: 'Show technical skills',
    run: () => [
      'Skills:',
      ...SKILLS.flatMap((group) => [
        `- ${group.label}:`,
        ...group.items.map((item) => `  ${item}`),
      ]),
    ],
  },
  contact: {
    description: 'Show contact links',
    run: () => ['Contact:', ...CONTACT.map((item) => `- ${item.label}: ${item.value}`)],
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
