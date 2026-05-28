/**
 * Domain types for application configuration and operating modes.
 */

export type Mode = 'translate' | 'correct' | 'comment';

export type CorrectionStyle = 'plain' | 'diff';

export type CommentStyle =
  | 'JSDoc'
  | 'Python Docstring (Google-Style)'
  | 'Python Docstring (NumPy-Style)'
  | 'Javadoc'
  | 'XML-Doc'
  | 'Doxygen'
  | 'Rustdoc'
  | 'Inline-Kommentare';

export interface ApiSettings {
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface ModeSettings {
  mode: Mode;
  targetLang: string;
  commentStyle: CommentStyle;
  correctionStyle: CorrectionStyle;
}

export const DEFAULT_API_SETTINGS: ApiSettings = {
  baseUrl: '',
  apiKey: '',
  model: '',
  temperature: 0.2,
  maxTokens: 32768,
};

export const DEFAULT_MODE_SETTINGS: ModeSettings = {
  mode: 'translate',
  targetLang: 'Deutsch',
  commentStyle: 'JSDoc',
  correctionStyle: 'plain',
};
