import type { ApiSettings, ModeSettings } from '../../types/settings';
import { DEFAULT_API_SETTINGS, DEFAULT_MODE_SETTINGS } from '../../types/settings';

/**
 * Persists user-facing settings in localStorage.
 *
 * Splits API settings from mode settings because they have different lifetimes:
 * API settings change rarely (once per user/provider), mode settings change per task.
 */
export class SettingsRepository {
  private static readonly KEYS = {
    baseUrl: 'llm_tools.baseUrl',
    apiKey: 'llm_tools.apiKey',
    model: 'llm_tools.model',
    temperature: 'llm_tools.temperature',
    maxTokens: 'llm_tools.maxTokens',
    mode: 'llm_tools.mode',
    targetLang: 'llm_tools.targetLang',
    commentStyle: 'llm_tools.commentStyle',
    correctionStyle: 'llm_tools.correctionStyle',
  } as const;

  loadApiSettings(): ApiSettings {
    const K = SettingsRepository.KEYS;
    return {
      baseUrl: this.readString(K.baseUrl, DEFAULT_API_SETTINGS.baseUrl),
      apiKey: this.readString(K.apiKey, DEFAULT_API_SETTINGS.apiKey),
      model: this.readString(K.model, DEFAULT_API_SETTINGS.model),
      temperature: this.readNumber(K.temperature, DEFAULT_API_SETTINGS.temperature),
      maxTokens: this.readNumber(K.maxTokens, DEFAULT_API_SETTINGS.maxTokens),
    };
  }

  saveApiSettings(settings: ApiSettings): void {
    const K = SettingsRepository.KEYS;
    this.writeString(K.baseUrl, settings.baseUrl);
    this.writeString(K.apiKey, settings.apiKey);
    this.writeString(K.model, settings.model);
    this.writeString(K.temperature, String(settings.temperature));
    this.writeString(K.maxTokens, String(settings.maxTokens));
  }

  loadModeSettings(): ModeSettings {
    const K = SettingsRepository.KEYS;
    return {
      mode: (this.readString(K.mode, DEFAULT_MODE_SETTINGS.mode) as ModeSettings['mode']),
      targetLang: this.readString(K.targetLang, DEFAULT_MODE_SETTINGS.targetLang),
      commentStyle: this.readString(
        K.commentStyle,
        DEFAULT_MODE_SETTINGS.commentStyle,
      ) as ModeSettings['commentStyle'],
      correctionStyle: this.readString(
        K.correctionStyle,
        DEFAULT_MODE_SETTINGS.correctionStyle,
      ) as ModeSettings['correctionStyle'],
    };
  }

  saveModeSettings(settings: ModeSettings): void {
    const K = SettingsRepository.KEYS;
    this.writeString(K.mode, settings.mode);
    this.writeString(K.targetLang, settings.targetLang);
    this.writeString(K.commentStyle, settings.commentStyle);
    this.writeString(K.correctionStyle, settings.correctionStyle);
  }

  private readString(key: string, fallback: string): string {
    const v = localStorage.getItem(key);
    return v ?? fallback;
  }

  private readNumber(key: string, fallback: number): number {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    const parsed = Number(v);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private writeString(key: string, value: string): void {
    // Empty values are removed so a re-load returns the default rather than ''.
    if (value === '' || value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  }
}
