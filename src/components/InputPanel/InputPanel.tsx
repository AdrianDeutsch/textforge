import { useCallback, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { Panel } from '../Panel/Panel';
import { IconButton } from '../Panel/IconButton';
import { FileParserRegistry } from '../../services/files/FileParserRegistry';
import type { Mode } from '../../types/settings';

const PLACEHOLDERS: Record<Mode, string> = {
  translate: 'Text zum Übersetzen hier einfügen...',
  correct: 'Text zur Rechtschreib- und Grammatikprüfung hier einfügen...',
  comment: 'Code (JS, Python, Java, C#, etc.) hier einfügen, der kommentiert werden soll...',
};

interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
  onSubmitShortcut: () => void;
  loading: boolean;
  mode: Mode;
  onError: (message: string) => void;
  onStatus: (message: string) => void;
}

/**
 * Multi-line input with file upload (PDF/DOCX) and helper buttons.
 *
 * File parsing is delegated to FileParserRegistry; this component only owns
 * the UI and orchestration concerns.
 */
export function InputPanel({
  value,
  onChange,
  onSubmitShortcut,
  loading,
  mode,
  onError,
  onStatus,
}: InputPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const registry = useMemo(() => new FileParserRegistry(), []);
  const [parsing, setParsing] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onSubmitShortcut();
      }
    },
    [onSubmitShortcut],
  );

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch {
      onError('Zugriff auf die Zwischenablage fehlgeschlagen. Bitte manuell einfügen (Strg+V).');
    }
  }, [onChange, onError]);

  const handleFileSelected = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      // Reset the input so picking the same file twice still triggers change.
      e.target.value = '';
      if (!file) return;

      if (!registry.supports(file)) {
        onError(`Dateityp wird nicht unterstützt: ${file.name}. Erlaubt sind PDF und DOCX.`);
        return;
      }

      setParsing(true);
      onStatus(`Lese ${file.name}...`);
      try {
        const text = await registry.parse(file);
        onChange(text);
        onStatus(`${file.name} (${text.length} Zeichen) geladen.`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        onError(`Datei konnte nicht gelesen werden: ${msg}`);
      } finally {
        setParsing(false);
      }
    },
    [onChange, onError, onStatus, registry],
  );

  return (
    <Panel
      title="Eingabe"
      actions={
        <>
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            disabled={parsing || loading}
            title="PDF oder DOCX laden"
          >
            {parsing ? 'Lädt...' : 'Datei laden'}
          </IconButton>
          <IconButton onClick={handlePaste} title="Aus Zwischenablage einfügen">
            Einfügen
          </IconButton>
          <IconButton onClick={() => onChange('')} title="Eingabe leeren">
            Leeren
          </IconButton>
        </>
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={registry.acceptAttribute}
        className="hidden"
        onChange={handleFileSelected}
      />
      <textarea
        className={`min-h-[420px] w-full flex-1 resize-y border-none bg-surface p-4 font-mono text-sm leading-[1.55] text-content outline-none transition placeholder:text-faint max-[860px]:min-h-[280px] ${
          loading ? 'bg-elevated opacity-70' : ''
        }`}
        value={value}
        placeholder={PLACEHOLDERS[mode]}
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
    </Panel>
  );
}
