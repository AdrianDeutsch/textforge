import { createContext, useContext } from 'react';
import type { ApiSettings, ModeSettings } from '../types/settings';

export interface SettingsContextValue {
  api: ApiSettings;
  mode: ModeSettings;
  updateApi: (patch: Partial<ApiSettings>) => void;
  updateMode: (patch: Partial<ModeSettings>) => void;
  isApiConfigured: boolean;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);

/**
 * Accessor for the settings context. Throws when used outside a
 * SettingsProvider so misuse fails loudly during development.
 */
export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}
