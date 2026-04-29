import { type KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { COMMANDS } from './core/commands';
import { ASCII_HEADER } from './core/data';
import { executeCommand } from './core/runner';
import type { TerminalLine } from './core/types';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/terminal.css';
import './styles/boot.css';

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
  const outputRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [shouldAutoFollow, setShouldAutoFollow] = useState(true);
  const [typingQueue, setTypingQueue] = useState<TerminalLine[]>([]);
  const [activeTypingLines, setActiveTypingLines] = useState<Array<{
    id: number;
    line: TerminalLine;
    visibleChars: number;
    waitMs: number;
  }>>([]);
  const typingIdRef = useRef(0);

  const enqueueLines = (lines: TerminalLine[]) => {
    if (lines.length === 0) return;
    setTypingQueue((prev) => [...prev, ...lines]);
  };

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const result = executeCommand(trimmed, {
      clearHistory: () => setHistory([]),
    });

    if (result.didClear) {
      setTypingQueue([]);
      setActiveTypingLines([]);
      return;
    }
    const immediateCommandLines = result.lines.filter((line) => line.kind === 'command');
    const typedLines = result.lines.filter((line) => line.kind !== 'command');

    if (immediateCommandLines.length > 0) {
      setHistory((prev) => [...prev, ...immediateCommandLines]);
    }
    enqueueLines(typedLines);
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

  useEffect(() => {
    if (typingQueue.length === 0) return;
    if (activeTypingLines.length >= maxConcurrentTypingLines) return;

    if (activeTypingLines.length > 0) {
      const latest = activeTypingLines[activeTypingLines.length - 1];
      const latestLineLength = Math.max(1, latest.line.text.length);
      const latestProgress = latest.visibleChars / latestLineLength;
      if (latestProgress < overlapStartRatio) return;
    }

    const [nextLine, ...rest] = typingQueue;
    setTypingQueue(rest);
    setActiveTypingLines((prev) => [
      ...prev,
      {
        id: typingIdRef.current++,
        line: nextLine,
        visibleChars: 0,
        waitMs: 0,
      },
    ]);
  }, [activeTypingLines, typingQueue]);

  useEffect(() => {
    if (activeTypingLines.length === 0) return;
    const timeoutId = window.setTimeout(() => {
      setActiveTypingLines((prev) =>
        prev.map((entry) => {
          const fullText = entry.line.text;

          if (entry.visibleChars >= fullText.length) {
            return entry;
          }

          if (entry.waitMs > typingTickMs) {
            return { ...entry, waitMs: entry.waitMs - typingTickMs };
          }

          const currentChar = fullText[entry.visibleChars];
          const isPunctuation = currentChar ? '.,:;!?'.includes(currentChar) : false;
          const delayMs = currentChar === ' ' ? 2 : isPunctuation ? 20 : 8;

          return {
            ...entry,
            visibleChars: entry.visibleChars + 1,
            waitMs: delayMs,
          };
        })
      );
    }, typingTickMs);

    return () => window.clearTimeout(timeoutId);
  }, [activeTypingLines]);

  useEffect(() => {
    if (activeTypingLines.length === 0) return;
    let completedPrefixCount = 0;
    for (const entry of activeTypingLines) {
      if (entry.visibleChars >= entry.line.text.length) {
        completedPrefixCount += 1;
        continue;
      }
      break;
    }

    if (completedPrefixCount === 0) return;

    const committed = activeTypingLines
      .slice(0, completedPrefixCount)
      .map((entry) => entry.line);
    setHistory((historyPrev) => [...historyPrev, ...committed]);
    setActiveTypingLines((prev) => prev.slice(completedPrefixCount));
  }, [activeTypingLines]);

  return (
    <main className="app-shell">
      <section className="panel terminal-panel">
        <div className="terminal-shell">
          <div className="terminal-titlebar" aria-hidden="true">
            <div className="terminal-tab">PowerShell</div>
          </div>

          <div className="terminal-screen">
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
                      <span className="terminal-transcript-prompt">
                        <span className="terminal-prompt-user">explorer</span>
                        <span className="terminal-prompt-host">@portfolio</span>
                        <span className="terminal-prompt-path">:~</span>
                        <span className="terminal-prompt-symbol">$</span>
                      </span>
                      {line.text.startsWith('> ') ? line.text.slice(2) : line.text}
                    </>
                  ) : (
                    line.text
                  )}
                </p>
              ))}
              {activeTypingLines.map((entry) => {
                return (
                  <p key={entry.id} className={`line-${entry.line.kind} line-typing-active`}>
                    {entry.line.kind === 'command' ? (
                      <>
                        <span className="terminal-transcript-prompt">
                          <span className="terminal-prompt-user">explorer</span>
                          <span className="terminal-prompt-host">@portfolio</span>
                          <span className="terminal-prompt-path">:~</span>
                          <span className="terminal-prompt-symbol">$</span>
                        </span>
                        {(entry.line.text.startsWith('> ')
                          ? entry.line.text.slice(2)
                          : entry.line.text
                        ).slice(0, entry.visibleChars)}
                      </>
                    ) : (
                      entry.line.text.slice(0, entry.visibleChars)
                    )}
                  </p>
                );
              })}

              <div className="terminal-active-prompt-line">
                <label className="terminal-prompt" htmlFor="terminal-input">
                  <span className="terminal-prompt-user">explorer</span>
                  <span className="terminal-prompt-host">@portfolio</span>
                  <span className="terminal-prompt-path">:~</span>
                  <span className="terminal-prompt-symbol">$</span>
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

      <aside className="panel preview-panel">
        <h2>Preview</h2>
        <p>No active view yet.</p>
        <p>Try: <code>whoami</code>, <code>projects</code>, <code>experience</code></p>
      </aside>
    </main>
  );
}

export default App;