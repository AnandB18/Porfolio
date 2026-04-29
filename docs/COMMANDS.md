# Command Reference

This file documents the current command surface and expected behavior.

## Built-in Commands

## `help`

- Lists all registered commands with descriptions.
- Source: generated from `COMMANDS` registry.

## `clear`

- Clears terminal output history.
- Implemented via `clearHistory()` callback in command context.

## `whoami`

- Returns short personal/profile summary lines.

## `about`

- Alias command (same output intent as `whoami`).

## `projects`

- Prints available project IDs and titles from `PROJECTS`.

## `experience`

- Prints role/org/period entries from `EXPERIENCE`.
- Includes nested highlight lines per experience item.

## `skills`

- Prints grouped skills from `SKILLS`.

## `contact`

- Prints contact endpoints from `CONTACT`.

## Keyboard Behavior

- `Enter`: execute current input
- `ArrowUp` / `ArrowDown`: navigate command history
- `Tab`:
  - if input empty -> default browser tab behavior
  - if input has query -> prefix autocomplete
  - if multiple matches -> print suggestion list

## Unknown Command Behavior

- Output includes:
  - `Command not found: <input>`
  - optional nearest suggestion line (`Did you mean: ...?`)

## Add a New Command

1. Add any new content constants to `src/core/data.ts` (if needed).
2. Add command entry to `src/core/commands.ts`:
   - `description`
   - `run` handler that returns `string[]`
3. Run app and test:
   - command execution
   - `help` output
   - autocomplete behavior
   - unknown command suggestion behavior

## Scope Guardrail

Current parser intentionally stays simple.

- No pipeline parsing (`|`) yet
- No command chaining (`;`) yet

Unsupported patterns should return a friendly message once parser guardrails are added.
