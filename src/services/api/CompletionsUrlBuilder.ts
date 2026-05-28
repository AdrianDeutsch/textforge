/**
 * Builds the final chat-completions URL from a user-supplied base URL.
 *
 * Detects common endpoint patterns so the user can paste any of:
 *  - https://provider/v1/chat/completions  (full)
 *  - https://provider/v1beta/openai        (provider segment after version)
 *  - http://localhost:1234                  (bare host)
 */
export class CompletionsUrlBuilder {
  build(rawBaseUrl: string): string {
    const trimmed = rawBaseUrl.replace(/\/+$/, '');
    if (/\/chat\/completions$/.test(trimmed)) {
      return trimmed;
    }
    // Matches /v1, /v1beta, /v1/openai, /v1beta/openai, etc.
    if (/\/v\d+(beta|alpha)?(\/[^/]+)?$/i.test(trimmed)) {
      return trimmed + '/chat/completions';
    }
    return trimmed + '/v1/chat/completions';
  }
}
