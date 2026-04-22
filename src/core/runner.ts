import { COMMANDS, getCommandSuggestion } from './commands';
import type { CommandContext, CommandExecutionResult, TerminalLine } from './types';

const asOutputLines = (lines: string[]): TerminalLine[] =>
  lines.map((text) => ({ text, kind: 'output' }));

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
        { text: `> ${trimmed}`, kind: 'command' },
        { text: `Unsupported token detected: ${hitToken}`, kind: 'error' },
        { text: 'Shell operators are not supported yet.', kind: 'hint' },
        { text: 'Please run one command at a time.', kind: 'hint' },
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
        { text: `> ${trimmed}`, kind: 'command' },
        { text: `Command not found: ${command}`, kind: 'error' },
        ...(suggestionLine ? [{ text: suggestionLine, kind: 'hint' as const }] : []),
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
    lines: [{ text: `> ${trimmed}`, kind: 'command' }, ...asOutputLines(output)],
    didClear: false,
  };
};
