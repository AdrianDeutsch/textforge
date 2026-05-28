import { useSettings } from '../../context/SettingsContext';

const ROW_CLASS = 'grid grid-cols-2 gap-3.5 max-[860px]:grid-cols-1';
const FIELD_CLASS = 'flex flex-col gap-1.5';
const LABEL_CLASS = 'text-xs tracking-[0.3px] text-muted';
const INPUT_CLASS =
  'rounded-btn border border-border bg-elevated px-3 py-2.5 font-sans text-sm text-content outline-none transition hover:border-border-strong focus:border-accent focus:shadow-[0_0_0_3px_var(--ring)] placeholder:text-faint';

export function SettingsPanel() {
  const { api, updateApi } = useSettings();

  return (
    <section className="mb-[18px] animate-fade-in-up rounded-card border border-border bg-surface p-5 shadow-card">
      <h2 className="m-0 mb-4 text-[13px] font-semibold tracking-[1px] text-muted uppercase">
        API-Konfiguration
      </h2>

      <div className={`${ROW_CLASS} mb-3.5`}>
        <div className={FIELD_CLASS}>
          <label className={LABEL_CLASS} htmlFor="baseUrl">
            Base-URL / Endpoint
          </label>
          <input
            id="baseUrl"
            className={INPUT_CLASS}
            type="text"
            value={api.baseUrl}
            placeholder="z.B. https://generativelanguage.googleapis.com/v1beta/openai  oder  http://localhost:1234"
            autoComplete="off"
            onChange={(e) => updateApi({ baseUrl: e.target.value })}
          />
        </div>
        <div className={FIELD_CLASS}>
          <label className={LABEL_CLASS} htmlFor="apiKey">
            API-Key
          </label>
          <input
            id="apiKey"
            className={INPUT_CLASS}
            type="password"
            value={api.apiKey}
            placeholder="sk-... bzw. dein Gemini-API-Key"
            autoComplete="off"
            onChange={(e) => updateApi({ apiKey: e.target.value })}
          />
        </div>
      </div>

      <div className={`${ROW_CLASS} mb-3.5`}>
        <div className={FIELD_CLASS}>
          <label className={LABEL_CLASS} htmlFor="modelName">
            Modell
          </label>
          <input
            id="modelName"
            className={INPUT_CLASS}
            type="text"
            value={api.model}
            placeholder="z.B. gemini-2.5-flash, gpt-4o-mini, local-model"
            autoComplete="off"
            onChange={(e) => updateApi({ model: e.target.value })}
          />
        </div>
        <div className={FIELD_CLASS}>
          <label className={LABEL_CLASS} htmlFor="temperature">
            Temperature (0.0 - 2.0)
          </label>
          <input
            id="temperature"
            className={INPUT_CLASS}
            type="number"
            min={0}
            max={2}
            step={0.1}
            value={api.temperature}
            onChange={(e) => updateApi({ temperature: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className={ROW_CLASS}>
        <div className={FIELD_CLASS}>
          <label className={LABEL_CLASS} htmlFor="maxTokens">
            Max. Output-Tokens
          </label>
          <input
            id="maxTokens"
            className={INPUT_CLASS}
            type="number"
            min={0}
            step={1}
            value={api.maxTokens}
            placeholder="z.B. 32768"
            onChange={(e) => updateApi({ maxTokens: Number(e.target.value) })}
          />
        </div>
        <div className={FIELD_CLASS}>
          <label className={LABEL_CLASS}>&nbsp;</label>
          <div className="flex h-[38px] items-center text-xs text-muted">
            Wert <code>0</code> = keinen Wert mitsenden.
          </div>
        </div>
      </div>

      <p className="mt-2.5 text-xs text-muted">
        Die App erkennt automatisch, ob deine URL bereits einen Pfad (z.B.{' '}
        <code>/v1beta/openai</code>) enthält, und hängt nur den fehlenden Teil bis{' '}
        <code>/chat/completions</code> an. Einstellungen werden lokal im Browser (localStorage)
        gespeichert. Es wird keinerlei Historie mitgesendet — jeder Request ist ein Single-Shot.
        <br />
        <br />
        <strong className="text-content">Schnellstart Google Gemini (Free Tier):</strong> Auf{' '}
        <a href="https://aistudio.google.com" target="_blank" rel="noreferrer">
          aistudio.google.com
        </a>{' '}
        API-Key erstellen → Base-URL:{' '}
        <code>https://generativelanguage.googleapis.com/v1beta/openai</code> → Modell:{' '}
        <code>gemini-2.5-flash</code>.
      </p>
    </section>
  );
}
