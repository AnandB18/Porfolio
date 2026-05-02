package app

import (
	"fmt"
	"strings"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

type lineKind string

const (
	lineSystem  lineKind = "system"
	lineCommand lineKind = "command"
	lineOutput  lineKind = "output"
	lineHint    lineKind = "hint"
	lineError   lineKind = "error"
)

type terminalLine struct {
	text string
	kind lineKind
}

type model struct {
	width          int
	height         int
	input          string
	mode           string
	lines          []terminalLine
	commandHistory []string
	historyIndex   int
}

func NewModel() model {
	lines := make([]terminalLine, 0, 24)
	for _, row := range data.ASCIIHeader {
		lines = append(lines, terminalLine{text: row, kind: lineSystem})
	}
	lines = append(lines,
		terminalLine{text: "", kind: lineSystem},
		terminalLine{text: "Welcome. Type 'menu' to explore, or 'about' to start.", kind: lineSystem},
		terminalLine{text: "Tip: 'help' is an alias for 'menu'.", kind: lineHint},
	)

	return model{
		mode:         "default",
		lines:        lines,
		historyIndex: -1,
	}
}

func (m model) Init() tea.Cmd { return nil }

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height
		return m, nil
	case tea.KeyMsg:
		switch msg.Type {
		case tea.KeyCtrlC:
			return m, tea.Quit
		case tea.KeyEnter:
			m.submitInput()
			return m, nil
		case tea.KeyBackspace, tea.KeyDelete:
			if len(m.input) > 0 {
				m.input = m.input[:len(m.input)-1]
			}
			return m, nil
		case tea.KeyUp:
			m.historyUp()
			return m, nil
		case tea.KeyDown:
			m.historyDown()
			return m, nil
		case tea.KeyTab:
			m.autocomplete()
			return m, nil
		default:
			if msg.Type == tea.KeyRunes {
				m.input += string(msg.Runes)
			}
			return m, nil
		}
	}

	return m, nil
}

func (m model) View() string {
	if m.width == 0 || m.height == 0 {
		return tuiTheme.Root.Render("Loading...")
	}

	leftWidth := m.width / 2
	if leftWidth < 56 {
		leftWidth = m.width
	}
	rightWidth := m.width - leftWidth
	if rightWidth < 28 {
		rightWidth = 0
	}

	left := m.renderTerminalPanel(leftWidth)
	if rightWidth == 0 {
		return tuiTheme.Root.Width(m.width).Render(left)
	}

	right := m.renderPreviewPanel(rightWidth)
	return tuiTheme.Root.Width(m.width).Render(lipgloss.JoinHorizontal(lipgloss.Top, left, right))
}

func (m *model) submitInput() {
	raw := strings.TrimSpace(m.input)
	if raw == "" {
		return
	}

	m.lines = append(m.lines, terminalLine{text: raw, kind: lineCommand})
	m.commandHistory = append(m.commandHistory, raw)
	m.historyIndex = -1
	m.input = ""
	m.runCommand(raw)
}

func (m *model) runCommand(raw string) {
	command := strings.ToLower(strings.TrimSpace(raw))
	if command == "" {
		return
	}

	switch command {
	case "menu", "help":
		m.mode = "default"
		m.emit(lineOutput, "Available commands:")
		m.emit(lineOutput, "- menu/help: show this command list")
		m.emit(lineOutput, "- about/whoami: learn about me")
		m.emit(lineOutput, "- projects: list available projects")
		m.emit(lineOutput, "- experience: show experience")
		m.emit(lineOutput, "- education: show education")
		m.emit(lineOutput, "- contact: show contact details")
		m.emit(lineOutput, "- clear: clear terminal output")
		m.emit(lineOutput, "- quit/exit: close app")
	case "about", "whoami":
		m.mode = "about"
		for _, line := range data.AboutLines {
			m.emit(lineOutput, line)
		}
	case "projects":
		m.mode = "projects"
		m.emit(lineOutput, "Projects:")
		for _, project := range data.Projects {
			m.emit(lineOutput, fmt.Sprintf("- %s: %s", project.ID, project.Title))
		}
		m.emit(lineHint, "Try: open <project-id> (example: open portfolio)")
	case "experience":
		m.mode = "experience"
		m.emit(lineOutput, "Experience:")
		for _, line := range data.ExperienceLines {
			m.emit(lineOutput, line)
		}
	case "education":
		m.mode = "education"
		m.emit(lineOutput, "Education:")
		for _, line := range data.EducationLines {
			m.emit(lineOutput, line)
		}
	case "contact":
		m.mode = "contact"
		m.emit(lineOutput, "Contact:")
		for _, c := range data.Contacts {
			m.emit(lineOutput, fmt.Sprintf("- %s: %s", c.Label, c.Value))
		}
	case "clear":
		m.mode = "default"
		m.lines = nil
	case "quit", "exit":
		m.emit(lineHint, "Use Ctrl+C to quit.")
	default:
		if strings.HasPrefix(command, "open ") {
			projectID := strings.TrimSpace(strings.TrimPrefix(command, "open "))
			if projectID == "" {
				m.emit(lineError, "Usage: open <project-id>")
				return
			}
			if m.openProject(projectID) {
				return
			}
		}

		m.emit(lineError, fmt.Sprintf("Command not found: %s", command))
		suggestion := m.suggestCommand(command)
		if suggestion != "" {
			m.emit(lineHint, fmt.Sprintf("Did you mean: %s?", suggestion))
		}
	}
}

func (m *model) openProject(id string) bool {
	for _, project := range data.Projects {
		if project.ID != id {
			continue
		}

		m.mode = "projectDetail:" + project.ID
		m.emit(lineOutput, fmt.Sprintf("%s (%s)", project.Title, project.ID))
		m.emit(lineOutput, project.Summary)
		m.emit(lineOutput, "Stack: "+strings.Join(project.Stack, ", "))
		return true
	}

	m.emit(lineError, fmt.Sprintf("No project found with id: %s", id))
	return false
}

func (m *model) emit(kind lineKind, text string) {
	m.lines = append(m.lines, terminalLine{text: text, kind: kind})
}

func (m *model) historyUp() {
	if len(m.commandHistory) == 0 {
		return
	}

	nextIndex := m.historyIndex
	if nextIndex == -1 {
		nextIndex = len(m.commandHistory) - 1
	} else {
		nextIndex = max(0, nextIndex-1)
	}

	m.historyIndex = nextIndex
	m.input = m.commandHistory[nextIndex]
}

func (m *model) historyDown() {
	if len(m.commandHistory) == 0 || m.historyIndex == -1 {
		return
	}

	nextIndex := m.historyIndex + 1
	if nextIndex >= len(m.commandHistory) {
		m.historyIndex = -1
		m.input = ""
		return
	}

	m.historyIndex = nextIndex
	m.input = m.commandHistory[nextIndex]
}

func (m *model) autocomplete() {
	query := strings.ToLower(strings.TrimSpace(m.input))
	if query == "" {
		return
	}

	commands := []string{"menu", "help", "about", "whoami", "projects", "open", "experience", "education", "contact", "clear", "quit", "exit"}
	matches := make([]string, 0, len(commands))
	for _, name := range commands {
		if strings.HasPrefix(name, query) {
			matches = append(matches, name)
		}
	}

	if len(matches) == 1 {
		m.input = matches[0] + " "
		return
	}
	if len(matches) > 1 {
		m.emit(lineHint, "Suggestions: "+strings.Join(matches, ", "))
	}
}

func (m model) suggestCommand(input string) string {
	commands := []string{"menu", "help", "about", "whoami", "projects", "open", "experience", "education", "contact", "clear", "quit"}
	for _, name := range commands {
		if strings.HasPrefix(name, input) {
			return name
		}
	}

	for _, name := range commands {
		if strings.Contains(name, input) || strings.Contains(input, name) {
			return name
		}
	}

	return ""
}

func (m model) renderTerminalPanel(width int) string {
	contentWidth := max(20, width-4)

	var sb strings.Builder
	sb.WriteString(tuiTheme.Header.Render("Portfolio Terminal"))
	sb.WriteString("\n\n")

	renderedLines := make([]string, 0, len(m.lines)+3)
	for _, line := range m.lines {
		renderedLines = append(renderedLines, m.renderLine(line))
	}

	maxLines := max(8, m.height-12)
	if len(renderedLines) > maxLines {
		renderedLines = renderedLines[len(renderedLines)-maxLines:]
	}

	sb.WriteString(strings.Join(renderedLines, "\n"))
	sb.WriteString("\n")
	sb.WriteString(m.renderPrompt() + " " + m.input)
	sb.WriteString("\n\n")
	sb.WriteString(tuiTheme.Muted.Render("Enter run | Tab autocomplete | Up/Down history | Ctrl+C quit"))

	return tuiTheme.Panel.Width(contentWidth).Render(sb.String())
}

func (m model) renderPreviewPanel(width int) string {
	contentWidth := max(20, width-4)
	title := tuiTheme.Header.Render("Preview")
	body := m.previewBody()
	return tuiTheme.Panel.Width(contentWidth).Render(title + "\n\n" + body)
}

func (m model) previewBody() string {
	switch {
	case m.mode == "default":
		return strings.Join([]string{
			data.Preview.Name,
			data.Preview.Role,
			"",
			data.Preview.Tagline,
			"",
			"Try: menu, about, projects, experience",
		}, "\n")
	case m.mode == "about":
		return strings.Join(data.AboutLines, "\n")
	case m.mode == "projects":
		rows := []string{"Projects"}
		for _, p := range data.Projects {
			rows = append(rows, fmt.Sprintf("- %s: %s", p.ID, p.Title))
		}
		rows = append(rows, "", "Try: open <project-id>")
		return strings.Join(rows, "\n")
	case strings.HasPrefix(m.mode, "projectDetail:"):
		projectID := strings.TrimPrefix(m.mode, "projectDetail:")
		for _, p := range data.Projects {
			if p.ID == projectID {
				return strings.Join([]string{
					p.Title,
					"",
					p.Summary,
					"",
					"Stack: " + strings.Join(p.Stack, ", "),
				}, "\n")
			}
		}
		return "Project not found."
	case m.mode == "experience":
		return strings.Join(data.ExperienceLines, "\n")
	case m.mode == "education":
		return strings.Join(data.EducationLines, "\n")
	case m.mode == "contact":
		rows := []string{"Contact"}
		for _, c := range data.Contacts {
			rows = append(rows, fmt.Sprintf("- %s: %s", c.Label, c.Value))
		}
		return strings.Join(rows, "\n")
	default:
		return "Preview unavailable for this mode."
	}
}

func (m model) renderPrompt() string {
	user := tuiTheme.PromptUser.Render("explorer")
	host := tuiTheme.PromptHost.Render("@portfolio")
	symbol := tuiTheme.PromptSymbol.Render("$")
	return user + host + " " + symbol
}

func (m model) renderLine(line terminalLine) string {
	switch line.kind {
	case lineCommand:
		return tuiTheme.CommandText.Render(m.renderPrompt() + " " + line.text)
	case lineError:
		return tuiTheme.ErrorText.Render(line.text)
	case lineHint:
		return tuiTheme.HintText.Render(line.text)
	case lineSystem:
		return tuiTheme.SystemText.Render(line.text)
	default:
		return tuiTheme.OutputText.Render(line.text)
	}
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
