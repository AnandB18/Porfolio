# Terminal Portfolio Implementation Plan

This plan tracks what is done, what is next, and what we are intentionally delaying.

## Current Status

- React + TypeScript app scaffolded.
- Two-panel layout in place (terminal + preview).
- Basic terminal loop works.
- Implemented commands:
  - `help`
  - `clear`
  - `whoami`
  - `projects`
- Keyboard features implemented:
  - command history with `ArrowUp` / `ArrowDown`
  - minimal `Tab` autocomplete behavior

## Next (Near-Term)

1. Implement `open <id>`
   - Parse command + args cleanly.
   - Validate project IDs from project list.
   - Show clear error for unknown IDs.

2. Connect `open <id>` to the preview panel
   - Add `activeProjectId` state.
   - Render selected project details on the right panel.
   - Keep terminal output concise and use panel for rich details.

3. Add remaining baseline commands
   - `skills`
   - `contact`
   - Optional alias: `about` -> `whoami`

4. Improve command UX
   - Keep unknown-command suggestions.
   - Keep autocomplete simple and predictable.
   - Preserve keyboard-first behavior without trapping focus.

## Later (Deliberately Deferred)

1. Boot/loading animation polish
   - Old-computer startup effect.
   - Keep short, optional, and respectful of reduced motion.

2. Styling polish
   - Refine terminal visuals in `terminal.css`.
   - Tune spacing/colors via CSS variables.
   - Improve mobile and resized window behavior.

3. CLI/TUI phase
   - Build Node CLI renderer after web GUI is stable.
   - Reuse command/data logic.

4. Extra feature ideas
   - Optional fun command/module (for example, a mini game) after core UX is complete.

## Parsing Scope Guardrails (Important)

For now, command parsing stays intentionally simple.

- We will **not** handle shell pipelines yet (`|`).
- We will **not** handle command sequences yet (`;`).
- If input includes `|` or `;`, treat it as unsupported and return a friendly message.
- Full pipeline/sequence behavior can be explored in a later phase.

## Definition of Done (Per Feature)

- Works with keyboard only (mouse remains supported).
- Works on mobile and resized desktop windows.
- No duplicated command logic.
- Uses existing types/CSS tokens consistently.
- Error and empty states are handled.
