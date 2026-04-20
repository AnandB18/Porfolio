import { useState } from 'react';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/terminal.css';
import './styles/boot.css';

type CommandContext = {
  clearHistory: () => void;
};

type CommandHandler = (ctx: CommandContext) => string[];

type CommandDefinition = {
  description: string;
  run: CommandHandler;
};

type Project = {
  id: string;
  title: string;
};

type Experience = {
  id: string;
  role: string;
  org: string;
  period: string;
  highlights: string[];
};

type SkillGroup = {
  label: string;
  items: string[];
};

type ContactLink = {
  label: string;
  value: string;
};

const PROJECTS: Project[] = [
  { id: 'portfolio', title: 'Terminal Portfolio' },
  { id: 'shell', title: 'Mini Shell' },
  { id: 'gcal-planner', title: 'Task Manager App' },
];

const EXPERIENCE: Experience[] = [
  {
    id: 'software-intern',
    role: 'Software Engineering Intern',
    org: 'Your Company',
    period: 'Summer 2025',
    highlights: ['Built internal tools and shipped production-facing updates.'],
  },
];

const SKILLS: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'C/C++'],
  },
  {
    label: 'Frontend',
    items: ['React', 'HTML/CSS', 'Responsive UI', 'Accessibility'],
  },
  {
    label: 'Tools',
    items: ['Git', 'Linux', 'Node.js', 'REST APIs'],
  },
];

const CONTACT: ContactLink[] = [
  { label: 'Email', value: 'your.email@example.com' },
  { label: 'GitHub', value: 'github.com/your-handle' },
  { label: 'LinkedIn', value: 'linkedin.com/in/your-handle' },
];

const COMMANDS: Record<string, CommandDefinition> = {
  help: {
    description: 'Show available commands',
    run: () => [
      'Available commands:',
      ...Object.entries(COMMANDS).map(
        ([name, def]) => `- ${name}: ${def.description}`
      ),
    ],
  },
  clear: {
    description: 'Clear terminal output',
    run: ({ clearHistory }) => {
      clearHistory();
      return [];
    },
  },
  whoami: {
    description: 'Learn about me',
    run: () => [
      'I am Anand...',
      'This portfolio is a terminal-inspired interface.',
      'Try: projects, experience, skills, contact',
    ],
  },
  about: {
    description: 'Alias for whoami',
    run: () => COMMANDS.whoami.run({ clearHistory: () => undefined }),
  },
  projects: {
    description: 'List available projects',
    run: () => [
      'Projects:',
      ...PROJECTS.map((p) => `- ${p.id}: ${p.title}`),
      'Project details panel wiring comes next.',
    ],
  },
  experience: {
    description: 'Show work experience',
    run: () => [
      'Experience:',
      ...EXPERIENCE.flatMap((item) => [
        `- ${item.role} | ${item.org} | ${item.period}`,
        ...item.highlights.map((point) => `  ${point}`),
      ]),
    ],
  },
  skills: {
    description: 'Show technical skills',
    run: () => [
      'Skills:',
      ...SKILLS.flatMap((group) => [
        `- ${group.label}:`,
        ...group.items.map((item) => `  ${item}`),
      ]),
    ],
  },
  contact: {
    description: 'Show contact links',
    run: () => [
      'Contact:',
      ...CONTACT.map((item) => `- ${item.label}: ${item.value}`),
    ],
  },
};

const getEditDistance = (a: string, b: string): number => {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) dp[i][0] = i;
  for (let j = 0; j < cols; j += 1) dp[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[a.length][b.length];
};

const getCommandSuggestion = (input: string): string | null => {
  const commandNames = Object.keys(COMMANDS);
  const prefixMatch = commandNames.find((name) => name.startsWith(input));

  if (prefixMatch) return prefixMatch;

  let bestMatch: string | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const name of commandNames) {
    const score = getEditDistance(input, name);
    if (score < bestScore) {
      bestScore = score;
      bestMatch = name;
    }
  }

  return bestScore <= 2 ? bestMatch : null;
};

function App() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Welcome. Type "help" to see commands.',
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    const command = trimmed.toLowerCase();

    if (!command) return;
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const def = COMMANDS[command];

    if (!def) {
      const suggestion = getCommandSuggestion(command);
      const suggestionLine = suggestion ? `Did you mean: ${suggestion}?` : null;
      setHistory((prev) => [
        ...prev,
        `> ${trimmed}`,
        `Command not found: ${command}`,
        ...(suggestionLine ? [suggestionLine] : []),
      ]);
      return;
    }

    const output = def.run({
      clearHistory: () => setHistory([]),
    });

    if (command === 'clear') return;

    setHistory((prev) => [...prev, `> ${trimmed}`, ...output]);
  };

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (commandHistory.length === 0) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();

      const nextIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);

      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();

      if (historyIndex === -1) return;

      const nextIndex = historyIndex + 1;

      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
        return;
      }

      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    }

    if (e.key === 'Tab') {    
      const query = input.trim().toLowerCase();
      const commandNames = Object.keys(COMMANDS);
    
      // If input is empty, just show available commands.
      if (!query) {
        return;
      }

      e.preventDefault();
    
      const matches = commandNames.filter((name) => name.startsWith(query));
    
      if (matches.length === 1) {
        setInput(`${matches[0]} `);
        return;
      }
    
      if (matches.length > 1) {
        setHistory((prev) => [...prev, `Suggestions: ${matches.join(', ')}`]);
      }
    
      return;
    }
  };

  return (
    <main className="app-shell">
      <section className="panel terminal-panel">
        <h2>Terminal</h2>

        <div>
          {history.map((line, idx) => (
            <p key={`${line}-${idx}`}>{line}</p>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runCommand(input);
            setInput('');
          }}
        >
          <label htmlFor="terminal-input">{'>'}</label>{' '}
          <input
            id="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </section>

      <aside className="panel preview-panel">
        <h2>Preview</h2>
        <p>Project images/details go here.</p>
      </aside>
    </main>
  );
}

export default App;