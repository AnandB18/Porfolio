package main

import (
	"fmt"
	"os"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/AnandB18/portfolio/tui/internal/app"
)

func main() {
	program := tea.NewProgram(app.NewModel(), tea.WithAltScreen())
	if _, err := program.Run(); err != nil {
		fmt.Fprintf(os.Stderr, "error running portfolio tui: %v\n", err)
		os.Exit(1)
	}
}
