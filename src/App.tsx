import { useCallback, useEffect, useRef, useState } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header/Header';
import { SettingsPanel } from './components/SettingsPanel/SettingsPanel';
import { Tabs } from './components/Tabs/Tabs';
import { ModeOptions } from './components/ModeOptions/ModeOptions';
import { ErrorBanner } from './components/ErrorBanner/ErrorBanner';
import { InputPanel } from './components/InputPanel/InputPanel';
import { OutputPanel } from './components/OutputPanel/OutputPanel';
import { SubmitBar } from './components/SubmitBar/SubmitBar';
import { useLlmRequest } from './hooks/useLlmRequest';

function AppShell() {
  const { api, mode, updateMode, isApiConfigured } = useSettings();
  const { loading, output, error, elapsedMs, send, clearOutput, dismissError } = useLlmRequest();

  // Settings panel opens automatically while configuration is incomplete; user
  // can still toggle it manually after that.
  const [settingsOpen, setSettingsOpen] = useState(!isApiConfigured);
  const [input, setInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [status, setStatus] = useState('Bereit.');
  const statusTimer = useRef<number | null>(null);

  const flashStatus = useCallback((msg: string) => {
    setStatus(msg);
    if (statusTimer.current) window.clearTimeout(statusTimer.current);
    statusTimer.current = window.setTimeout(() => setStatus('Bereit.'), 2200);
  }, []);

  useEffect(() => {
    if (!isApiConfigured) setSettingsOpen(true);
  }, [isApiConfigured]);

  useEffect(() => {
    if (loading) {
      setStatus('Anfrage läuft...');
    } else if (elapsedMs !== null) {
      flashStatus(`Antwort erhalten in ${elapsedMs} ms.`);
    }
  }, [loading, elapsedMs, flashStatus]);

  const handleSubmit = useCallback(async () => {
    setLocalError(null);
    dismissError();
    if (!api.baseUrl.trim()) {
      setLocalError('Bitte zuerst eine Base-URL in den Einstellungen eintragen.');
      setSettingsOpen(true);
      return;
    }
    if (!api.apiKey.trim()) {
      setLocalError('Bitte zuerst einen API-Key in den Einstellungen eintragen.');
      setSettingsOpen(true);
      return;
    }
    if (!api.model.trim()) {
      setLocalError(
        'Bitte ein Modell in den Einstellungen angeben (z.B. gpt-4o-mini, gemini-2.5-flash, oder den lokalen Modellnamen).',
      );
      setSettingsOpen(true);
      return;
    }
    if (!input.trim()) {
      setLocalError('Die Eingabe ist leer. Bitte Text oder Code einfügen.');
      return;
    }
    await send(input, api, mode);
  }, [api, mode, input, send, dismissError]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      flashStatus('Ausgabe in die Zwischenablage kopiert.');
    } catch {
      setLocalError('Kopieren fehlgeschlagen.');
    }
  }, [output, flashStatus]);

  // Two error sources (preflight validation vs. API call) share one banner.
  const visibleError = localError ?? error;
  const dismissAllErrors = () => {
    setLocalError(null);
    dismissError();
  };

  return (
    <div className="mx-auto max-w-[1400px] px-7 pt-8 pb-14 max-[860px]:px-4 max-[860px]:pt-[18px] max-[860px]:pb-9">
      <Header onToggleSettings={() => setSettingsOpen((v) => !v)} />
      {settingsOpen && <SettingsPanel />}
      <Tabs current={mode.mode} onChange={(m) => updateMode({ mode: m })} />
      <ModeOptions />
      <ErrorBanner message={visibleError} onClose={dismissAllErrors} />

      <main className="grid grid-cols-2 gap-5 max-[860px]:grid-cols-1">
        <InputPanel
          value={input}
          onChange={setInput}
          onSubmitShortcut={handleSubmit}
          loading={loading}
          mode={mode.mode}
          onError={setLocalError}
          onStatus={flashStatus}
        />
        <OutputPanel
          content={output}
          loading={loading}
          mode={mode.mode}
          correctionStyle={mode.correctionStyle}
          onCopy={handleCopy}
          onClear={clearOutput}
        />
      </main>

      <SubmitBar loading={loading} status={status} onSubmit={handleSubmit} />

      <footer className="mt-9 border-t border-border pt-6 text-center text-xs text-muted">
        Single Page App · React · TypeScript · Single-Shot Request · Keine Konversations-Historie
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AppShell />
      </SettingsProvider>
    </ThemeProvider>
  );
}
