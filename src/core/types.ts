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
};

export type Experience = {
  id: string;
  role: string;
  org: string;
  period: string;
  highlights: string[];
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
  lines: string[];
  didClear: boolean;
};
