import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { Document } from "@langchain/core/documents";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export interface SourceDocument {
  source: string;
  sourceHash: string;
  docs: Document[];
}

const SUPPORTED_EXTENSIONS = new Set([".pdf", ".md", ".txt"]);

async function walkFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

export async function listKnowledgeFiles(directory: string): Promise<string[]> {
  const allFiles = await walkFiles(directory);
  return allFiles.filter((filePath) =>
    SUPPORTED_EXTENSIONS.has(path.extname(filePath).toLowerCase()),
  );
}

async function computeFileHash(filePath: string): Promise<string> {
  const content = await readFile(filePath);
  return createHash("sha256").update(content).digest("hex");
}

function toSourceName(filePath: string, knowledgeRoot: string): string {
  return path.relative(knowledgeRoot, filePath).replaceAll("\\", "/");
}

export async function loadKnowledgeSource(
  filePath: string,
  knowledgeRoot: string,
): Promise<SourceDocument | null> {
  const extension = path.extname(filePath).toLowerCase();
  const source = toSourceName(filePath, knowledgeRoot);
  const sourceHash = await computeFileHash(filePath);

  let docs: Document[] = [];
  if (extension === ".pdf") {
    docs = await new PDFLoader(filePath).load();
  } else if (extension === ".md" || extension === ".txt") {
    docs = await new TextLoader(filePath).load();
  } else {
    return null;
  }

  const normalized: Document[] = [];
  for (const doc of docs) {
    const content = doc.pageContent.trim();
    if (!content) continue;
    normalized.push(
      new Document({
        pageContent: content,
        metadata: {
          ...doc.metadata,
          source,
          source_hash: sourceHash,
        },
      }),
    );
  }

  if (!normalized.length) return null;

  return { source, sourceHash, docs: normalized };
}
