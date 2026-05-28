/**
 * Mammoth ships its browser bundle as a CommonJS file without type declarations.
 * The runtime API surface mirrors the main export but only the methods we use
 * are declared here.
 */
declare module 'mammoth/mammoth.browser' {
  interface ExtractInput {
    arrayBuffer: ArrayBuffer;
  }
  interface ExtractResult {
    value: string;
    messages: unknown[];
  }
  const mammoth: {
    extractRawText(input: ExtractInput): Promise<ExtractResult>;
  };
  export default mammoth;
}
