import { type KeyboardEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { COMMANDS } from './core/commands';
import {
  ABOUT_PREVIEW,
  ASCII_HEADER,
  CURRENTLY_ITEMS,
  EDUCATION,
  EXPERIENCE,
  PREVIEW_DEFAULT_COMMANDS,
  PREVIEW_DEFAULT_NAME,
  PREVIEW_DEFAULT_ROLE,
  PREVIEW_DEFAULT_TAGLINE,
  SOCIAL_LINKS,
} from './core/data';
import anandImage from './assets/Profile_Pic.jpg';
import avatarPhoto from './assets/Avatar_Photo.png';
import redRisingPhoto from './assets/Red_Rising_Photo.jpg';
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

type PreviewState =
  | 'default'
  | 'whoami'
  | 'about'
  | 'projects'
  | 'experience'
  | 'education'
  | 'contact';
type PreviewEffect = 'idle' | 'pulse' | 'spike';

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
  const [previewEffect, setPreviewEffect] = useState<PreviewEffect>('idle');
  const outputRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewEffectTimeoutRef = useRef<number | null>(null);
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
  const currentlyImageMap: Record<string, string> = {
    'reading-image': redRisingPhoto,
    'watching-image': avatarPhoto,
  };

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
      setPreviewEffect('idle');
      return;
    }

    if (Object.hasOwn(COMMANDS, command)) {
      if (previewEffectTimeoutRef.current !== null) {
        window.clearTimeout(previewEffectTimeoutRef.current);
      }

      if (command === 'help') {
        setPreviewEffect('pulse');
        previewEffectTimeoutRef.current = window.setTimeout(() => {
          setPreviewEffect('idle');
          previewEffectTimeoutRef.current = null;
        }, 750);
      } else {
        setPreviewState(command as PreviewState);
        setPreviewEffect('spike');
        previewEffectTimeoutRef.current = window.setTimeout(() => {
          setPreviewEffect('idle');
          previewEffectTimeoutRef.current = null;
        }, 1000);
      }
    }

    const immediateCommandLines = result.lines.filter((line) => line.kind === 'command');
    const typedLines = result.lines.filter((line) => line.kind !== 'command');

    if (immediateCommandLines.length > 0) {
      setHistory((prev) => [...prev, ...immediateCommandLines]);
    }
    enqueueLines(typedLines);
  };

  const renderPreviewContent = () => {
    const renderCommandHint = (line: string) =>
      line.split(/(\s+)/).map((token, idx) => {
        const normalized = token.toLowerCase().replace(/[^a-z-]/g, '');
        const isCommand = Object.hasOwn(COMMANDS, normalized);

        return (
          <span key={`${token}-${idx}`} className={isCommand ? 'preview-cmd' : undefined}>
            {token}
          </span>
        );
      });

    if (previewState === 'default') {
      return (
        <div className="preview-default">
          <div className="preview-default-content">
            <h3 className="preview-name">{PREVIEW_DEFAULT_NAME}</h3>
            <p className="preview-role">{PREVIEW_DEFAULT_ROLE}</p>
            <p className="preview-tagline">{PREVIEW_DEFAULT_TAGLINE}</p>
            <p className="preview-commands">{renderCommandHint(PREVIEW_DEFAULT_COMMANDS)}</p>
          </div>
        </div>
      );
    }

    if (previewState === 'whoami' || previewState === 'about') {
      return (
        <section className="preview-about">
          <div className="preview-about-top">
            <div className="preview-about-text">
              <h3 className="preview-about-title">{ABOUT_PREVIEW.title}</h3>
              {ABOUT_PREVIEW.paragraphs.map((paragraph, idx) => (
                <p key={`${paragraph}-${idx}`}>{paragraph}</p>
              ))}
              <div className="preview-about-links" aria-label="Connect links">
                {SOCIAL_LINKS.map((item) => {
                  const isExternal = item.href.startsWith('http');
                  return (
                    <a
                      key={item.label}
                      className="preview-about-link"
                      href={item.href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noreferrer' : undefined}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="preview-about-image-wrap">
              <img className="preview-about-image" src={anandImage} alt={ABOUT_PREVIEW.imageAlt} />
            </div>
          </div>
          <section className="preview-currently" aria-label="Currently">
            <h4 className="preview-currently-title">Currently</h4>
            <div className="preview-currently-grid">
              {CURRENTLY_ITEMS.map((item) => {
                const hasLink = Boolean(item.href && item.href.trim() !== '');
                const imageSrc = item.imageKey ? currentlyImageMap[item.imageKey] : undefined;
                return (
                  <article key={`${item.label}-${item.title}`} className="preview-currently-card">
                    <p className="preview-currently-label">{item.label}</p>
                    <div className="preview-currently-top">
                      {imageSrc ? (
                        <img
                          className="preview-currently-image"
                          src={imageSrc}
                          alt={item.imageAlt ?? `${item.label} thumbnail`}
                        />
                      ) : (
                        <div className="preview-currently-image preview-currently-image-placeholder" />
                      )}
                      <div className="preview-currently-meta">
                        <h5 className="preview-currently-item-title">
                          {hasLink ? (
                            <a
                              className="preview-currently-item-link"
                              href={item.href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {item.title}
                            </a>
                          ) : (
                            item.title
                          )}
                        </h5>
                        {item.subtitle ? (
                          <p className="preview-currently-subtitle">{item.subtitle}</p>
                        ) : null}
                      </div>
                    </div>
                    <p className="preview-currently-description">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </section>
        </section>
      );
    }

    if (previewState === 'experience') {
      return (
        <section className="preview-experience" aria-label="Experience">
          <h3 className="preview-experience-title">Experience</h3>
          <div className="preview-experience-timeline">
            {EXPERIENCE.map((item) => (
              <article key={item.id} className="preview-experience-item">
                <div className="preview-experience-card">
                  <header className="preview-experience-head">
                    <h4 className="preview-experience-role">{item.role}</h4>
                    <p className="preview-experience-meta">
                      <span className="preview-experience-org">{item.org}</span>
                      <span className="preview-experience-period">{item.period}</span>
                    </p>
                  </header>
                  <ul className="preview-experience-highlights">
                    {item.highlights.map((point) => (
                      <li key={`${item.id}-${point}`}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (previewState === 'education') {
      return (
        <section className="preview-experience" aria-label="Education">
          <h3 className="preview-experience-title">Education</h3>
          <div className="preview-experience-timeline">
            {EDUCATION.map((item) => (
              <article key={item.id} className="preview-experience-item">
                <div className="preview-experience-card">
                  <header className="preview-experience-head">
                    <h4 className="preview-experience-role">{item.school}</h4>
                    <p className="preview-experience-meta">
                      <span className="preview-experience-org">{item.program}</span>
                      <span className="preview-experience-period">{item.period}</span>
                    </p>
                  </header>
                  <ul className="preview-experience-highlights">
                    {item.location ? <li key={`${item.id}-location`}>Location: {item.location}</li> : null}
                    {item.gpa ? <li key={`${item.id}-gpa`}>GPA: {item.gpa}</li> : null}
                    {item.honors?.map((honor) => (
                      <li key={`${item.id}-honor-${honor}`}>Honor: {honor}</li>
                    ))}
                    {item.highlights?.map((point) => (
                      <li key={`${item.id}-highlight-${point}`}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
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

  useEffect(() => {
    return () => {
      if (previewEffectTimeoutRef.current !== null) {
        window.clearTimeout(previewEffectTimeoutRef.current);
      }
    };
  }, []);

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
            <div
              className={`preview-output preview-output-${previewState} preview-effect-${previewEffect}`}
            >
              {renderPreviewContent()}
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}

export default App;