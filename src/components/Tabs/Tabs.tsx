import type { Mode } from '../../types/settings';

const TAB_DEFINITIONS: readonly { mode: Mode; label: string }[] = [
  { mode: 'translate', label: 'Übersetzung' },
  { mode: 'correct', label: 'Rechtschreibung & Grammatik' },
  { mode: 'comment', label: 'Code-Kommentierung' },
];

const TAB_BASE =
  'flex-1 min-w-[140px] cursor-pointer rounded-lg border-none px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition ' +
  'max-[860px]:min-w-0 max-[860px]:px-2.5 max-[860px]:text-[13px]';

const TAB_ACTIVE = 'bg-accent font-semibold text-on-accent shadow-[0_3px_12px_var(--accent-glow)]';
const TAB_INACTIVE = 'bg-transparent text-muted hover:bg-elevated hover:text-content';

interface TabsProps {
  current: Mode;
  onChange: (mode: Mode) => void;
}

export function Tabs({ current, onChange }: TabsProps) {
  return (
    <nav
      role="tablist"
      className="mb-4 flex gap-1 overflow-x-auto rounded-card border border-border bg-surface p-[5px] shadow-soft"
    >
      {TAB_DEFINITIONS.map((t) => (
        <button
          key={t.mode}
          type="button"
          role="tab"
          aria-selected={current === t.mode}
          className={`${TAB_BASE} ${current === t.mode ? TAB_ACTIVE : TAB_INACTIVE}`}
          onClick={() => onChange(t.mode)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
