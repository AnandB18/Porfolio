import { type KeyboardEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { COMMANDS } from './core/commands';
import {
  ASCII_HEADER,
  PREVIEW_DEFAULT_NAME,
  PREVIEW_DEFAULT_ROLE,
  PREVIEW_DEFAULT_TAGLINE,
} from './core/data';
import { executeCommand } from './core/runner';
import type { TerminalLine } from './core/types';
import { useTerminalTyping } from './hooks/useTerminalTyping';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/window.css';
import './styles/terminal.css';
import './styles/preview.css';
import './styles/boot.css';

type PreviewState = 'default' | 'help' | 'whoami' | 'about' | 'projects' | 'experience' | 'contact';

function App() {
  const maxConcurrentTypingLines = 3;
  const overlapStartRatio = 0.2;
  const typingTickMs = 8;
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    ...ASCII_HEADER.map((text) => ({ text, kind: 'ascii' as const })),
    { text: '', kind: 'system' },
    { text: 'Welcome. Type "help" to see commands.', kind: 'system' },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [previewState, setPreviewState] = useState<PreviewState>('default');
  const outputRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [shouldAutoFollow, setShouldAutoFollow] = useState(true);
  const commitTypedLines = useCallback((lines: TerminalLine[]) => {
    if (lines.length === 0) return;
    setHistory((prev) => [...prev, ...lines]);
  }, []);
  const { activeTypingLines, enqueueLines, clearTyping } = useTerminalTyping({
    maxConcurrentTypingLines,
    overlapStartRatio,
    typingTickMs,
    onCommitLines: commitTypedLines,
  });

  const renderPrompt = () => (
    <span className="terminal-transcript-prompt">
      <span className="terminal-prompt-user">explorer</span>
      <span className="terminal-prompt-host">@portfolio</span>
      <span className="terminal-prompt-path">:~</span>
      <span className="terminal-prompt-symbol">$</span>
    </span>
  );

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const command = trimmed.toLowerCase();

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const result = executeCommand(trimmed, {
      clearHistory: () => setHistory([]),
    });

    if (result.didClear) {
      clearTyping();
      setPreviewState('default');
      return;
    }

    if (Object.hasOwn(COMMANDS, command)) {
      setPreviewState(command as PreviewState);
    }

    const immediateCommandLines = result.lines.filter((line) => line.kind === 'command');
    const typedLines = result.lines.filter((line) => line.kind !== 'command');

    if (immediateCommandLines.length > 0) {
      setHistory((prev) => [...prev, ...immediateCommandLines]);
    }
    enqueueLines(typedLines);
  };

  const renderPreviewContent = () => {
    if (previewState === 'default') {
      return (
        <div className="preview-default">
          <div className="preview-default-content">
            <h3 className="preview-name">{PREVIEW_DEFAULT_NAME}</h3>
            <p className="preview-role">{PREVIEW_DEFAULT_ROLE}</p>
            <p className="preview-tagline">{PREVIEW_DEFAULT_TAGLINE}</p>
          </div>
        </div>
      );
    }

    return <p>Preview state: {previewState}</p>;
  };

  const submitCurrentInput = () => {
    runCommand(input);
    setInput('');
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
    if (e.key === 'Enter') {
      e.preventDefault();
      submitCurrentInput();
      return;
    }

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
        enqueueLines([{ text: `Suggestions: ${matches.join(', ')}`, kind: 'hint' }]);
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
  }, [history, activeTypingLines, shouldAutoFollow]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [history, activeTypingLines]);

  return (
    <main className="app-shell">
      <section className="panel window-panel terminal-panel">
        <div className="window-shell">
          <div className="window-titlebar" aria-hidden="true">
            <div className="window-tab">PowerShell</div>
          </div>

          <div className="window-body terminal-body">
            <div
              ref={outputRef}
              onScroll={handleOutputScroll}
              className="terminal-output"
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((line, idx) => (
                <p key={`${line.text}-${idx}`} className={`line-${line.kind}`}>
                  {line.kind === 'command' ? (
                    <>
                      {renderPrompt()}
                      {line.text}
                    </>
                  ) : (
                    line.text
                  )}
                </p>
              ))}
              {activeTypingLines.map((entry) => {
                return (
                  <p key={entry.id} className={`line-${entry.line.kind} line-typing-active`}>
                    {entry.line.text.slice(0, entry.visibleChars)}
                  </p>
                );
              })}

              <div className="terminal-active-prompt-line">
                <label className="terminal-prompt" htmlFor="terminal-input">
                  {renderPrompt()}
                </label>
                <input
                  ref={inputRef}
                  id="terminal-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="panel window-panel preview-panel">
        <div className="window-shell">
          <div className="window-titlebar" aria-hidden="true">
            <div className="window-tab">Preview</div>
          </div>
          <div className="window-body preview-body">
            <div className={`preview-output preview-output-${previewState}`}>
              {renderPreviewContent()}
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}

export default App;