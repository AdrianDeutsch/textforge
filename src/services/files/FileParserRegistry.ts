import type { IFileParser } from './IFileParser';
import { PdfFileParser } from './PdfFileParser';
import { DocxFileParser } from './DocxFileParser';

/**
 * Picks the appropriate parser for an uploaded file.
 *
 * Acts as the strategy selector. New file formats are integrated by passing
 * additional `IFileParser` implementations to the constructor — callers stay
 * decoupled from concrete classes (Dependency Inversion).
 */
export class FileParserRegistry {
  private readonly parsers: readonly IFileParser[];

  constructor(parsers: readonly IFileParser[] = [new PdfFileParser(), new DocxFileParser()]) {
    this.parsers = parsers;
  }

  supports(file: File): boolean {
    return this.parsers.some((p) => p.canHandle(file));
  }

  async parse(file: File): Promise<string> {
    const parser = this.parsers.find((p) => p.canHandle(file));
    if (!parser) {
      throw new Error(`Dateityp wird nicht unterstützt: ${file.name}`);
    }
    return parser.parse(file);
  }

  get acceptAttribute(): string {
    // The HTML `accept` attribute for the file input. Hard-coded for the two
    // supported formats. If you add a parser, update this list.
    return '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
}
