# Portfolio TUI (Go + Bubble Tea)

This folder contains a standalone terminal UI version of the portfolio.

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
- `about` (`whoami`)
- `projects`
- `open <project-id>`
- `experience`
- `education`
- `contact`
- `clear`
- `quit` (`exit`)

## Customize Colors

Edit `internal/app/styles.go` and adjust the `tuiTheme` values.
