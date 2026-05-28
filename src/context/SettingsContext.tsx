import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ApiSettings, ModeSettings } from '../types/settings';
import { SettingsRepository } from '../services/storage/SettingsRepository';

interface SettingsContextValue {
  api: ApiSettings;
  mode: ModeSettings;
  updateApi: (patch: Partial<ApiSettings>) => void;
  updateMode: (patch: Partial<ModeSettings>) => void;
  isApiConfigured: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

interface SettingsProviderProps {
  children: ReactNode;
  repository?: SettingsRepository;
}

/**
 * Provides API and mode settings to the component tree and persists every
 * change via the injected repository.
 */
export function SettingsProvider({ children, repository }: SettingsProviderProps) {
  const repo = useMemo(() => repository ?? new SettingsRepository(), [repository]);
  const [api, setApi] = useState<ApiSettings>(() => repo.loadApiSettings());
  const [mode, setMode] = useState<ModeSettings>(() => repo.loadModeSettings());

  useEffect(() => {
    repo.saveApiSettings(api);
  }, [api, repo]);

  useEffect(() => {
    repo.saveModeSettings(mode);
  }, [mode, repo]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      api,
      mode,
      updateApi: (patch) => setApi((prev) => ({ ...prev, ...patch })),
      updateMode: (patch) => setMode((prev) => ({ ...prev, ...patch })),
      isApiConfigured: Boolean(api.baseUrl.trim() && api.apiKey.trim() && api.model.trim()),
    }),
    [api, mode],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}
