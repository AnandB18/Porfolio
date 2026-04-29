# Terminal Portfolio (Web First)

Interactive portfolio built as a terminal-style web app using React + TypeScript.

The current focus is a keyboard-first command interface in the left panel, with a right panel reserved for richer GUI content.

## Current Features

- Command execution with typed input and output history
- Built-in commands:
  - `help`
  - `clear`
  - `whoami`
  - `about` (alias for whoami content)
  - `projects`
  - `experience`
  - `contact`
- Command history navigation (`ArrowUp` / `ArrowDown`)
- Minimal `Tab` autocomplete (prefix-based)
- Unknown command suggestions (`Did you mean: ...?`)
- Two-panel responsive layout scaffold

## Project Structure

```txt
src/
  App.tsx                 # UI/controller layer for terminal input + rendering
  core/
    types.ts              # Shared types for command/data/runner contracts
    data.ts               # Portfolio content data (projects, experience, contact)
    commands.ts           # Command registry + command helpers
    runner.ts             # Command execution pipeline
  styles/
    tokens.css            # Design tokens (colors, spacing, radius)
    base.css              # Global reset + base typography
    layout.css            # Two-panel grid layout
    terminal.css          # Terminal-specific styling (in progress)
    boot.css              # Boot animation styling (planned)
```

## Run Locally

```bash
npm install
npm run dev
```

## Architecture Notes

- Logic has been extracted from `App.tsx` into `src/core/*`.
- `App.tsx` is focused on UI state and keyboard behavior.
- Commands are centralized in `src/core/commands.ts`.
- Content is centralized in `src/core/data.ts`.

This makes it easier to reuse command logic for a future CLI/TUI interface.

## Docs

- `STARTER_CONVENTIONS.md` - coding conventions and feature done criteria
- `IMPLEMENTATION_PLAN.md` - phased roadmap and deferred items
- `docs/ARCHITECTURE.md` - command flow and module responsibilities
- `docs/COMMANDS.md` - command reference and extension guide
