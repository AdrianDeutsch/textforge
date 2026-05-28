/**
 * OpenAI-compatible chat completion types.
 */

export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature: number;
  stream: false;
  max_tokens?: number;
}

export interface ChatCompletionChoice {
  message: ChatMessage;
  index?: number;
  finish_reason?: string;
}

export interface ChatCompletionResponse {
  choices: ChatCompletionChoice[];
}

export interface LlmRequestParams {
  systemPrompt: string;
  userPrompt: string;
}
