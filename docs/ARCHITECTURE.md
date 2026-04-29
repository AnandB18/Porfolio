# Architecture Guide

## Goal

Keep one command system that can power multiple interfaces:

- Web terminal UI (current)
- CLI/TUI interface (planned)

## Layer Responsibilities

## `src/core/types.ts`

Defines shared contracts:

- command context
- command definitions
- content models (projects, experience, contact)
- command execution result

This is the contract boundary between logic and interfaces.

## `src/core/data.ts`

Contains static portfolio content:

- `PROJECTS`
- `EXPERIENCE`
- `CONTACT`

Keep this file content-focused (no UI logic).

## `src/core/commands.ts`

Contains:

- `COMMANDS` registry
- command descriptions (used by `help`)
- command handlers
- unknown-command suggestion helpers

The `COMMANDS` object is the source of truth for command names and behavior.

## `src/core/runner.ts`

Contains command execution orchestration:

1. Normalize raw input
2. Resolve command from registry
3. Handle unknown command + suggestion output
4. Execute command handler
5. Return standardized result (`lines`, `didClear`)

This keeps execution behavior consistent across future interfaces.

## `src/App.tsx`

UI/controller layer:

- terminal input state
- output history state
- keyboard handling (`ArrowUp`, `ArrowDown`, `Tab`)
- form submit wiring
- rendering terminal + preview panels

`App.tsx` should avoid owning business logic that belongs in `src/core/*`.

## Command Flow

1. User submits input
2. `runCommand()` in `App.tsx` forwards input to `executeCommand()`
3. `executeCommand()` returns result lines + clear flag
4. `App.tsx` updates terminal history state

## Extension Pattern

When adding a new command:

1. Add content data in `src/core/data.ts` if needed
2. Add command entry in `src/core/commands.ts`
3. Ensure help text describes it clearly
4. Verify autocomplete + unknown suggestion behavior still works

## Planned Evolution

- Add parser guardrails for unsupported shell syntax (`|`, `;`)
- Move toward structured response objects for richer dual-rendering (web + CLI)
- Add right-panel view modes while keeping core commands UI-agnostic
