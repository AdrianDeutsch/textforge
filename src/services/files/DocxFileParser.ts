import mammoth from 'mammoth/mammoth.browser';
import type { IFileParser } from './IFileParser';

/**
 * Extracts raw text from a DOCX file using mammoth's browser build.
 */
export class DocxFileParser implements IFileParser {
  private static readonly DOCX_MIME =
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  canHandle(file: File): boolean {
    return file.type === DocxFileParser.DOCX_MIME || /\.docx$/i.test(file.name);
  }

  async parse(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value.trim();
  }
}
