/**
 * Contract for converting an uploaded file into plain text.
 *
 * `canHandle` is the discriminator for the strategy/registry pattern, so callers
 * can support more formats by registering additional parsers without touching
 * existing ones (Open/Closed).
 */
export interface IFileParser {
  canHandle(file: File): boolean;
  parse(file: File): Promise<string>;
}
