import * as pdfjs from 'pdfjs-dist';
// `?url` is a Vite-specific suffix that returns the asset URL of the bundled
// worker file so pdf.js can spawn it from the same origin.
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { IFileParser } from './IFileParser';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type TextItem = { str: string; transform?: number[] };
type TextChunk = { items?: TextItem[] };

/**
 * Extracts visible text from a PDF using pdf.js.
 * Multi-column layouts are approximated by inserting line breaks at large Y-jumps.
 */
export class PdfFileParser implements IFileParser {
  canHandle(file: File): boolean {
    return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  }

  async parse(file: File): Promise<string> {
    // Pass a Uint8Array view; pdf.js keeps a reference to the buffer and detaches
    // it on destroy, so we hand it a typed array rather than the raw ArrayBuffer.
    const buffer = new Uint8Array(await file.arrayBuffer());
    const doc = await pdfjs.getDocument({ data: buffer }).promise;
    const pages: string[] = [];

    try {
      for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
        const page = await doc.getPage(pageNum);
        const items = await this.readTextItems(page);
        pages.push(this.itemsToText(items));
      }
      return pages.join('\n\n').trim();
    } finally {
      await doc.destroy();
    }
  }

  // pdf.js' `getTextContent()` iterates the underlying ReadableStream via
  // `for await ... of`, which needs `ReadableStream.prototype[Symbol.asyncIterator]`.
  // Safari < 16.4 ships ReadableStream without that method and throws
  // "undefined is not a function (near '...value of readableStream...')".
  // Reading the stream manually with `getReader()` sidesteps the missing iterator.
  private async readTextItems(page: pdfjs.PDFPageProxy): Promise<TextItem[]> {
    const stream = page.streamTextContent() as ReadableStream<TextChunk>;
    const reader = stream.getReader();
    const items: TextItem[] = [];
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value?.items?.length) items.push(...value.items);
      }
    } finally {
      reader.releaseLock();
    }
    return items;
  }

  private itemsToText(items: TextItem[]): string {
    // pdf.js emits items in reading order with absolute coordinates.
    // We rebuild line breaks by tracking the Y position of the previous item.
    let prevY: number | null = null;
    let line = '';
    const lines: string[] = [];

    for (const item of items) {
      const y = item.transform ? item.transform[5] : null;
      if (prevY !== null && y !== null && Math.abs(y - prevY) > 2) {
        lines.push(line.trimEnd());
        line = '';
      }
      line += item.str;
      prevY = y;
    }
    if (line) lines.push(line.trimEnd());
    return lines.join('\n');
  }
}
