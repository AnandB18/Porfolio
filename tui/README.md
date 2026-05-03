# Portfolio TUI (Go + Bubble Tea)

This folder contains a standalone terminal UI version of the portfolio.

Layout: single stacked panel with workspace preview on top and terminal transcript/input at the bottom.

## Run

```bash
cd ..
npm run export:data
cd tui
go run ./cmd/portfolio
```

`src/core/data.ts` is the source of truth. Exporting regenerates `shared/portfolio-data.json`, which the TUI loads at startup.

## Commands

- `menu` (`help`)
- `whoami`
- `education`
- `experience`
- `projects`
- `contact`
- `tab <name>`
- `open <project-id>`
- `clear`
- `quit` (`exit`)
- `resume` (placeholder)
- `snake` (placeholder)

## Keyboard

- `Left` / `Right` switch tabs
- `1..5` jump to tabs directly
- `Esc` exits project detail view

## Customize Colors

Edit `internal/app/styles.go` and adjust the `tuiTheme` values.
