import { COMMANDS, getCommandSuggestion } from './commands';
import type { CommandContext, CommandExecutionResult } from './types';

export const executeCommand = (
  raw: string,
  ctx: CommandContext
): CommandExecutionResult => {
  // Normalize user input once so command lookup is consistent.
  const trimmed = raw.trim();
  const command = trimmed.toLowerCase();

  // For now we intentionally support only one command at a time.
  const unsupportedTokens = ['&&', '||', '|', ';', '>>', '>', '<', '&'];
  const hitToken = unsupportedTokens.find((token) => trimmed.includes(token));

  if (hitToken) {
    return {
      lines: [
        `> ${trimmed}`,
        `Unsupported token detected: ${hitToken}`,
        'Shell operators are not supported yet.',
        'Please run one command at a time.',
      ],
      didClear: false,
    };
  }

  if (!command) {
    return { lines: [], didClear: false };
  }

  const def = COMMANDS[command];

  if (!def) {
    const suggestion = getCommandSuggestion(command);
    const suggestionLine = suggestion ? `Did you mean: ${suggestion}?` : null;
    return {
      lines: [
        `> ${trimmed}`,
        `Command not found: ${command}`,
        ...(suggestionLine ? [suggestionLine] : []),
      ],
      didClear: false,
    };
  }

  const output = def.run(ctx);

  // Clear mutates state via context callback, so no output lines are returned.
  if (command === 'clear') {
    return { lines: [], didClear: true };
  }

  return {
    lines: [`> ${trimmed}`, ...output],
    didClear: false,
  };
};
