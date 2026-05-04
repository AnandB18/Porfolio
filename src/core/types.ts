export type CommandContext = {
  clearHistory: () => void;
};

export type CommandHandler = (ctx: CommandContext) => string[];

export type CommandDefinition = {
  description: string;
  run: CommandHandler;
};

export type Project = {
  id: string;
  title: string;
  status?: 'current' | 'completed';
  /** Short bullet-sized lines for the preview card (easier to scan than one long paragraph). */
  summaryLines?: string[];
  stack?: string[];
  imageKey?: string;
  imageAlt?: string;
  repoUrl?: string;
  liveUrl?: string;
};

export type Experience = {
  id: string;
  role: string;
  org: string;
  period: string;
  highlights: string[];
};

export type Education = {
  id: string;
  school: string;
  program: string;
  period: string;
  location?: string;
  /** Single-line GPA when you do not split technical vs cumulative */
  gpa?: string;
  gpaTechnical?: string;
  gpaCumulative?: string;
  honors?: string[];
  coursework?: string[];
  highlights?: string[];
};

export type SkillGroup = {
  label: string;
  items: string[];
};

export type ContactLink = {
  label: string;
  value: string;
};

export type CommandExecutionResult = {
  lines: TerminalLine[];
  didClear: boolean;
};

export type TerminalLineKind =
  | 'ascii'
  | 'system'
  | 'command'
  | 'output'
  | 'hint'
  | 'error';

export type TerminalLine = {
  text: string;
  kind: TerminalLineKind;
};

export type CurrentlyItem = {
  label: string;
  title: string;
  subtitle?: string;
  description: string;
  imageKey?: string;
  imageAlt?: string;
  href?: string;
};
