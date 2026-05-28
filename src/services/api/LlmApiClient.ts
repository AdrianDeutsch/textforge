import type { ApiSettings } from '../../types/settings';
import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  LlmRequestParams,
} from '../../types/api';
import { CompletionsUrlBuilder } from './CompletionsUrlBuilder';
import { LlmApiError } from './LlmApiError';

/**
 * Encapsulates HTTP communication with an OpenAI-compatible chat completion endpoint.
 *
 * The client is intentionally stateless: each `complete()` call is a single-shot
 * request and never carries prior history. Dependencies (URL builder, fetch) are
 * injected to keep the class testable and SOLID-compliant.
 */
export class LlmApiClient {
  private readonly urlBuilder: CompletionsUrlBuilder;
  private readonly fetchFn: typeof fetch;

  constructor(urlBuilder: CompletionsUrlBuilder = new CompletionsUrlBuilder(), fetchFn: typeof fetch = fetch.bind(globalThis)) {
    this.urlBuilder = urlBuilder;
    this.fetchFn = fetchFn;
  }

  async complete(settings: ApiSettings, params: LlmRequestParams): Promise<string> {
    const url = this.urlBuilder.build(settings.baseUrl);
    const payload = this.buildPayload(settings, params);

    let resp: Response;
    try {
      resp = await this.fetchFn(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      // Network-level failure (DNS, CORS, offline) — fetch rejects with TypeError.
      const message = err instanceof Error ? err.message : String(err);
      throw new LlmApiError(
        message,
        null,
        'Möglicherweise CORS- oder Netzwerkproblem. Bei lokalen Backends (z.B. LM Studio) sicherstellen, dass der Server CORS erlaubt.',
      );
    }

    if (!resp.ok) {
      const detail = await this.extractErrorDetail(resp);
      throw new LlmApiError(
        `HTTP ${resp.status} ${resp.statusText}${detail ? ' — ' + detail : ''}`,
        resp.status,
      );
    }

    const data = (await resp.json()) as ChatCompletionResponse;
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || content.length === 0) {
      throw new LlmApiError('Die API-Antwort enthielt kein gültiges choices[0].message.content.');
    }
    return content.trim();
  }

  private buildPayload(settings: ApiSettings, params: LlmRequestParams): ChatCompletionRequest {
    const payload: ChatCompletionRequest = {
      model: settings.model,
      messages: [
        { role: 'system', content: params.systemPrompt },
        { role: 'user', content: params.userPrompt },
      ],
      temperature: Number.isFinite(settings.temperature) ? settings.temperature : 0.2,
      stream: false,
    };
    if (Number.isFinite(settings.maxTokens) && settings.maxTokens > 0) {
      payload.max_tokens = settings.maxTokens;
    }
    return payload;
  }

  private async extractErrorDetail(resp: Response): Promise<string> {
    try {
      const errJson = await resp.json();
      return errJson?.error?.message ?? JSON.stringify(errJson);
    } catch {
      try {
        return await resp.text();
      } catch {
        return '';
      }
    }
  }
}
