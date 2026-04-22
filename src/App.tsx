import { type KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { COMMANDS } from './core/commands';
import { executeCommand } from './core/runner';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/terminal.css';
import './styles/boot.css';

function App() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Welcome. Type "help" to see commands.',
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const [shouldAutoFollow, setShouldAutoFollow] = useState(true);

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const result = executeCommand(trimmed, {
      clearHistory: () => setHistory([]),
    });

    if (result.didClear) return;

    setHistory((prev) => [...prev, ...result.lines]);
  };

  const handleOutputScroll = () => {
    const el = outputRef.current;
    if (!el) return;
  
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom < 24;
    setShouldAutoFollow(nearBottom);
  };

  // Handles keyboard-first terminal interactions (history + autocomplete).
  const handleInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Tab') {
      const query = input.trim().toLowerCase();
      const commandNames = Object.keys(COMMANDS);

      // Empty input keeps default browser tab navigation.
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
  };

  useEffect(() => {
    const el = outputRef.current;
    if (!el || !shouldAutoFollow) return;
  
    el.scrollTop = el.scrollHeight;
  }, [history, shouldAutoFollow]);

  return (
    <main className="app-shell">
      <section className="panel terminal-panel">
        <h2>Terminal</h2>

        <div
          ref={outputRef}
          onScroll={handleOutputScroll}
          className="terminal-output"
        >
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
        <p>No active view yet.</p>
        <p>Try: <code>whoami</code>, <code>projects</code>, <code>experience</code></p>
      </aside>
    </main>
  );
}

export default App;