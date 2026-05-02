package app

import "github.com/charmbracelet/lipgloss"

type theme struct {
	Root         lipgloss.Style
	Panel        lipgloss.Style
	Header       lipgloss.Style
	SystemText   lipgloss.Style
	OutputText   lipgloss.Style
	ErrorText    lipgloss.Style
	HintText     lipgloss.Style
	CommandText  lipgloss.Style
	PromptUser   lipgloss.Style
	PromptHost   lipgloss.Style
	PromptSymbol lipgloss.Style
	Muted        lipgloss.Style
}

var tuiTheme = theme{
	Root: lipgloss.NewStyle().
		Padding(1, 2).
		Background(lipgloss.Color("#0B0F14")).
		Foreground(lipgloss.Color("#D2E4DC")),
	Panel: lipgloss.NewStyle().
		Border(lipgloss.RoundedBorder()).
		BorderForeground(lipgloss.Color("#2F3D3B")).
		Padding(1),
	Header: lipgloss.NewStyle().
		Foreground(lipgloss.Color("#79C0FF")).
		Bold(true),
	SystemText: lipgloss.NewStyle().
		Foreground(lipgloss.Color("#C3D1CF")),
	OutputText: lipgloss.NewStyle().
		Foreground(lipgloss.Color("#D2E4DC")),
	ErrorText: lipgloss.NewStyle().
		Foreground(lipgloss.Color("#FF6B6B")),
	HintText: lipgloss.NewStyle().
		Foreground(lipgloss.Color("#E5C07B")),
	CommandText: lipgloss.NewStyle().
		Foreground(lipgloss.Color("#98C379")),
	PromptUser: lipgloss.NewStyle().Foreground(lipgloss.Color("#98C379")),
	PromptHost: lipgloss.NewStyle().Foreground(lipgloss.Color("#79C0FF")),
	PromptSymbol: lipgloss.NewStyle().Foreground(lipgloss.Color("#C3D1CF")),
	Muted: lipgloss.NewStyle().Foreground(lipgloss.Color("#7A8B87")),
}
