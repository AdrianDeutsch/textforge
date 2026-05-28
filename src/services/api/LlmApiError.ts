/**
 * Distinguishes recoverable API-level errors from generic exceptions so the UI
 * can surface them with context (status code, hint about CORS, etc.).
 */
export class LlmApiError extends Error {
  readonly status: number | null;
  readonly hint: string | null;

  constructor(message: string, status: number | null = null, hint: string | null = null) {
    super(message);
    this.name = 'LlmApiError';
    this.status = status;
    this.hint = hint;
  }
}
