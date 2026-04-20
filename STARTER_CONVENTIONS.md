# Starter Convention Checklist

Pin this in your repo and follow it during every change.

- **Project shape**: keep `core` (logic/data), `web` (React renderer), `styles` (CSS) clearly separated.
- **File naming**: components in `PascalCase.tsx`; utils/data/types in `camelCase.ts` or `kebab-case.css` consistently.
- **Component size**: target under ~150 lines; if larger, split by responsibility.
- **Single responsibility**: one component = one UI concern; one module = one logic concern.
- **No UI in core**: `core` never imports React, DOM APIs, or CSS.
- **Typed contracts**: command input/output types live in one shared `types` module.
- **Stable IDs**: reference projects by `id`, never by display title.
- **Data-first editing**: all portfolio content in `core/data/*`, not hardcoded in components.
- **CSS tokens only in one place**: colors/spacing/motion variables in `styles/tokens.css`.
- **Semantic CSS vars**: use `--color-bg`, `--space-3`, `--duration-fast`; avoid random names.
- **No magic values**: if a color/spacing repeats, convert it to a variable.
- **Accessibility baseline**: keyboard usable, visible focus states, reduced-motion respected.
- **Animation discipline**: subtle, short, optional; never block interaction for long.
- **Command consistency**: each command has deterministic output + helpful error response.
- **Unknown command UX**: always show suggestion (`Did you mean ...?`).
- **Mobile first-check**: verify terminal input and panel behavior on small screens early.
- **Responsive check per feature**: every feature must work across narrow, medium, and wide windows before it is considered done.
- **PR self-check before commit**: run typecheck/lint, scan for dead code, confirm no duplicated logic.
- **Docs habit**: update a short `README` section whenever you add/change commands.

## Quick Done Criteria (per feature)

- Works with keyboard only
- Uses existing types and tokens
- No duplicated command logic
- No hardcoded content in UI
- Error/empty state handled
- Works on mobile and resized desktop windows

## Naming Rules

- **Types**: `CommandInput`, `CommandResponse`, `ProjectRecord`
- **State vars**: `activeProjectId`, `isBooting`, `commandHistory`
- **Handlers**: `handleHelpCommand`, `handleOpenCommand`
- **Renderers**: `renderTextResponse`, `renderProjectResponse`
- **CSS classes**: `terminal-panel`, `preview-panel`, `boot-overlay`
