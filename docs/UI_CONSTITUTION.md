# UI Constitution

## Purpose

Use this document as the visual and interaction north star for the portfolio.

The app is web-first and terminal-inspired. We emulate TUI clarity and keyboard flow while keeping a polished GUI experience. Components can change, but the design language and behavior principles stay consistent.

## Product Principles

- Keyboard-first, mouse-friendly second.
- Information density over decorative noise.
- Clear hierarchy with restrained motion.
- Every panel feels part of one shell.
- Commands and content speak the same tone.

## Visual Language

## Color Roles (semantic, not hard-coded names)

- `bg.canvas`: global page background.
- `bg.panel`: window/panel background.
- `bg.elevated`: selected rows, active tabs, focused blocks.
- `text.primary`: primary readable text.
- `text.muted`: helper metadata and secondary labels.
- `accent.primary`: command highlights and active affordances.
- `state.success`: positive feedback.
- `state.warning`: caution.
- `state.error`: invalid command and failures.
- `border.default`: structural boundaries.

Rules:

- Use color by role, never ad-hoc per component.
- At least AA contrast for text on all panel backgrounds.
- Error and warning colors are reserved for true states, not decoration.

## Typography

- Terminal and command regions use monospace.
- Long-form narrative content can use one complementary sans-serif if needed.
- Keep heading scale compact; avoid oversized hero text inside the shell.
- Preserve line-length comfort in preview panes.

## Spacing and Shape

- Use one spacing scale (for example 4/8/12/16/24/32).
- Consistent panel radius and border weight across terminal and preview.
- Keep padding rhythm consistent between titlebar, body, and footer.
- Avoid mixed shadows; prefer subtle depth and clear borders.

## Interaction Model

## Input and Navigation

- Enter executes current command.
- Arrow up/down traverses command history.
- Tab autocompletes command prefixes.
- Escape exits nested/detail states.
- `q` or `Ctrl+C` exits focus mode where applicable.

If a key is supported in one terminal-like context, do not silently remove it in another.

## State Model

Drive UI from explicit modes:

- `default`
- `about`
- `projects`
- `projectDetail`
- `experience`
- `education`
- `contact`
- `resume`

Command handlers should map to deterministic mode transitions.

## Feedback and Motion

- Prefer immediate textual feedback over toasts.
- Keep transitions short and subtle.
- Typing effects should support legibility and never block interaction.
- Unknown commands should always include helpful next steps (`help` and nearest suggestion).

## Layout System

## Shell Structure

- Left: command interface and transcript.
- Right: rich preview/content pane.
- Bottom (optional): status/help bar with active keys.

## Responsive Behavior

- At smaller widths, stack panes while preserving command-first flow.
- Do not remove command transcript on mobile; collapse secondary preview first.
- Keep prompt and input always visible when terminal panel is active.

## Content Voice and Copy

- Short, direct, and technical-friendly.
- Prefer action-first wording (for example, "Type `projects` to list work.").
- Keep labels consistent between commands and pane titles.
- Avoid mixing playful copy with formal academic copy in adjacent blocks.

## Component Rules

- Use shared tokens from `src/styles/tokens.css` only.
- New components must define normal, hover, focus, active, and disabled states.
- Focus indicators are mandatory for keyboard targets.
- Icon usage is supportive, not primary; text remains the source of truth.

## Engineering Guardrails

- Keep command logic in `src/core/*`; avoid UI-only forks of command behavior.
- Avoid component-specific one-off colors, spacing, or animation curves.
- If a style exception is necessary, document why in code comments near the exception.
- Refactors can change structure, not the semantic design roles.

## Change Acceptance Checklist

A UI change is complete only if:

- It uses existing semantic tokens.
- Keyboard flow still works end-to-end.
- Focus states are visible and consistent.
- Command wording and panel wording remain aligned.
- Terminal and preview panes still look like one system.
- Small-screen behavior remains legible and usable.

## Rollout Plan

1. Normalize tokens and remove one-off style values.
2. Add consistent focus and active states across interactive elements.
3. Introduce optional status/help bar with contextual key hints.
4. Tighten copy to match command tone.
5. Run a final consistency pass across terminal, preview, and supporting UI.
