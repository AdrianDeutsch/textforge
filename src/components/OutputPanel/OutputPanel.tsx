import { Panel } from '../Panel/Panel';
import { IconButton } from '../Panel/IconButton';
import type { Mode, CorrectionStyle } from '../../types/settings';
import { renderDiffMarkup } from './DiffMarkup';

interface OutputPanelProps {
  content: string;
  loading: boolean;
  mode: Mode;
  correctionStyle: CorrectionStyle;
  onCopy: () => void;
  onClear: () => void;
}

export function OutputPanel({
  content,
  loading,
  mode,
  correctionStyle,
  onCopy,
  onClear,
}: OutputPanelProps) {
  const isEmpty = !content;
  const useDiff = !isEmpty && mode === 'correct' && correctionStyle === 'diff';

  return (
    <Panel
      title="Ausgabe"
      actions={
        <>
          <IconButton onClick={onCopy} disabled={isEmpty} title="Ausgabe kopieren">
            Kopieren
          </IconButton>
          <IconButton onClick={onClear} disabled={isEmpty} title="Ausgabe leeren">
            Leeren
          </IconButton>
        </>
      }
    >
      <pre
        className={`m-0 min-h-[420px] w-full flex-1 overflow-auto p-4 font-mono text-sm leading-[1.55] break-words whitespace-pre-wrap text-content transition max-[860px]:min-h-[280px] ${
          isEmpty ? 'font-sans text-muted italic' : ''
        } ${loading ? 'bg-elevated opacity-70' : 'bg-surface'}`}
      >
        {isEmpty
          ? 'Hier erscheint das Ergebnis...'
          : useDiff
            ? renderDiffMarkup(content)
            : content}
      </pre>
    </Panel>
  );
}
