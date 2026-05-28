import { useSettings } from '../../context/SettingsContext';
import type { CommentStyle, CorrectionStyle } from '../../types/settings';

const TARGET_LANGS = ['Deutsch', 'Englisch', 'Französisch', 'Spanisch', 'Italienisch'] as const;

const COMMENT_STYLES: readonly { value: CommentStyle; label: string }[] = [
  { value: 'JSDoc', label: 'JSDoc (JavaScript/TypeScript)' },
  { value: 'Python Docstring (Google-Style)', label: 'Python Docstring (Google-Style)' },
  { value: 'Python Docstring (NumPy-Style)', label: 'Python Docstring (NumPy-Style)' },
  { value: 'Javadoc', label: 'Javadoc (Java)' },
  { value: 'XML-Doc', label: 'XML-Doc (C#)' },
  { value: 'Doxygen', label: 'Doxygen (C/C++)' },
  { value: 'Rustdoc', label: 'Rustdoc (Rust)' },
  { value: 'Inline-Kommentare', label: 'Inline-Kommentare (sprachneutral)' },
];

const CORRECTION_STYLES: readonly { value: CorrectionStyle; label: string }[] = [
  { value: 'plain', label: 'Korrigierter Text (nur Ergebnis)' },
  { value: 'diff', label: 'Mit Markierung der Änderungen' },
];

const LABEL_CLASS = 'text-[13px] font-medium text-muted';
const SELECT_CLASS =
  'cursor-pointer rounded-btn border border-border bg-elevated px-3 py-2 font-sans text-sm text-content outline-none transition hover:border-border-strong focus:border-accent focus:shadow-[0_0_0_3px_var(--ring)]';
const DESCRIPTION_CLASS = 'ml-auto text-[13px] text-muted italic max-[860px]:hidden';

export function ModeOptions() {
  const { mode, updateMode } = useSettings();

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3.5 rounded-card border border-border bg-surface px-4 py-3.5 shadow-soft">
      {mode.mode === 'translate' && (
        <>
          <span className={LABEL_CLASS}>Zielsprache:</span>
          <select
            className={SELECT_CLASS}
            value={mode.targetLang}
            onChange={(e) => updateMode({ targetLang: e.target.value })}
          >
            {TARGET_LANGS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <span className={DESCRIPTION_CLASS}>
            Übersetzt den eingegebenen Text in die gewählte Zielsprache.
          </span>
        </>
      )}

      {mode.mode === 'correct' && (
        <>
          <span className={LABEL_CLASS}>Ausgabeformat:</span>
          <select
            className={SELECT_CLASS}
            value={mode.correctionStyle}
            onChange={(e) => updateMode({ correctionStyle: e.target.value as CorrectionStyle })}
          >
            {CORRECTION_STYLES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span className={DESCRIPTION_CLASS}>
            Korrigiert Rechtschreibung &amp; Grammatik im Single-Shot-Verfahren.
          </span>
        </>
      )}

      {mode.mode === 'comment' && (
        <>
          <span className={LABEL_CLASS}>Kommentar-Stil:</span>
          <select
            className={SELECT_CLASS}
            value={mode.commentStyle}
            onChange={(e) => updateMode({ commentStyle: e.target.value as CommentStyle })}
          >
            {COMMENT_STYLES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span className={DESCRIPTION_CLASS}>
            Fügt Dokumentations-Kommentare direkt in den Code ein.
          </span>
        </>
      )}
    </div>
  );
}
