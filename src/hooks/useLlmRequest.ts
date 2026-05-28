import { useCallback, useMemo, useRef, useState } from 'react';
import type { ApiSettings, ModeSettings } from '../types/settings';
import { LlmApiClient } from '../services/api/LlmApiClient';
import { LlmApiError } from '../services/api/LlmApiError';
import { PromptBuilder } from '../services/api/PromptBuilder';

interface UseLlmRequestResult {
  loading: boolean;
  output: string;
  error: string | null;
  elapsedMs: number | null;
  send: (input: string, api: ApiSettings, mode: ModeSettings) => Promise<void>;
  clearOutput: () => void;
  dismissError: () => void;
}

/**
 * Glue hook that wires the React UI to the API client and prompt builder.
 * Keeps the components free of service instantiation and timing logic.
 */
export function useLlmRequest(): UseLlmRequestResult {
  const clientRef = useRef(new LlmApiClient());
  const builderRef = useRef(new PromptBuilder());

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  const send = useCallback(async (input: string, api: ApiSettings, mode: ModeSettings) => {
    setError(null);
    setLoading(true);
    setElapsedMs(null);
    const t0 = performance.now();

    try {
      const userPrompt = builderRef.current.buildUserPrompt(input, mode);
      const systemPrompt = builderRef.current.buildSystemPrompt();
      const content = await clientRef.current.complete(api, { systemPrompt, userPrompt });
      setOutput(content);
      setElapsedMs(Math.round(performance.now() - t0));
    } catch (err) {
      const message = err instanceof LlmApiError && err.hint ? `${err.message} ${err.hint}` : err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearOutput = useCallback(() => setOutput(''), []);
  const dismissError = useCallback(() => setError(null), []);

  return useMemo(
    () => ({ loading, output, error, elapsedMs, send, clearOutput, dismissError }),
    [loading, output, error, elapsedMs, send, clearOutput, dismissError],
  );
}
