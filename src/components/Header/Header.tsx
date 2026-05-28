import { useSettings } from '../../context/SettingsContext';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onToggleSettings: () => void;
}

export function Header({ onToggleSettings }: HeaderProps) {
  const { isApiConfigured } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'hell' : 'dunkel';

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="grid h-10 w-10 place-items-center rounded-[11px] bg-linear-to-br from-accent to-accent-2 text-[18px] font-bold tracking-[-0.5px] text-white shadow-[0_4px_16px_var(--accent-glow),inset_0_1px_0_rgba(255,255,255,0.25)]">
          L
        </div>
        <div>
          <h1 className="m-0 text-[19px] font-semibold tracking-[-0.2px]">LLM Textwerkzeuge</h1>
          <div className="mt-0.5 text-xs text-muted">Single-Shot · OpenAI-kompatibel</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          title={`Zu ${nextTheme}em Theme wechseln`}
          aria-label={`Zu ${nextTheme}em Theme wechseln`}
          className="grid h-[38px] w-[38px] cursor-pointer place-items-center rounded-btn border border-border bg-surface text-muted transition hover:border-border-strong hover:bg-elevated hover:text-content active:translate-y-px"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <button
          type="button"
          onClick={onToggleSettings}
          title="Einstellungen anzeigen/verstecken"
          className="inline-flex cursor-pointer items-center gap-2 rounded-btn border border-border bg-surface px-[15px] py-2.5 text-[13px] font-medium text-content transition hover:border-border-strong hover:bg-elevated active:translate-y-px"
        >
          <span
            className={`inline-block h-2 w-2 rounded-full transition ${
              isApiConfigured ? 'bg-success ring-4 ring-success/20' : 'bg-danger ring-4 ring-danger/20'
            }`}
          />
          <span>Einstellungen</span>
        </button>
      </div>
    </header>
  );
}

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
