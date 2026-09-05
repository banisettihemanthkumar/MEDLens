/**
 * PDF Text & Metadata Extractor
 *
 * IMPORTANT: This module must ONLY be called from Node.js Server Actions or
 * API Route handlers. It must never run in Edge Runtime or on the client.
 * pdf-parse is listed in serverExternalPackages in next.config.ts to prevent
 * bundling, which would cause Vercel build failures.
 */
export interface ExtractedPdfDocument {
  text: string;
  numPages: number;
  info?: Record<string, any>;
  pages: Array<{
    pageNumber: number;
    text: string;
  }>;
}

export async function extractTextFromPdfBuffer(buffer: Buffer): Promise<ExtractedPdfDocument> {
  // Guard: pdf-parse is a Node.js-only module and must not run in edge/browser contexts
  if (typeof window !== "undefined") {
    throw new Error("extractTextFromPdfBuffer must only be called on the server.");
  }

  try {
    // Dynamic require prevents Next.js from statically bundling pdf-parse.
    // pdf-parse reads test PDF files from disk at require-time, which would crash
    // Vercel's build if it were statically bundled. The dynamic require + 
    // serverExternalPackages config ensures it is treated as a runtime dependency.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);

    // Split text by page delimiters if available, or approximate
    const rawPages = data.text.split(/(?:\f|\n\s*---\s*Page\s*\d+\s*---\s*\n)/i);
    const pages = rawPages
      .map((pgText: string, idx: number) => ({
        pageNumber: idx + 1,
        text: pgText.trim(),
      }))
      .filter((p: { text: string }) => p.text.length > 0);

    return {
      text: data.text,
      numPages: data.numpages || (pages.length > 0 ? pages.length : 1),
      info: data.info,
      pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: data.text }],
    };
  } catch (err) {
    console.warn("pdf-parse fallback triggered:", err);
    // Graceful plain-text decoding if buffer contains text/plain or raw characters
    const fallbackText = buffer.toString("utf-8");
    return {
      text: fallbackText,
      numPages: 1,
      pages: [{ pageNumber: 1, text: fallbackText }],
    };
  }
}

