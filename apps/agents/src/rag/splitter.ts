import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 700,
  chunkOverlap: 120,
});

export async function splitDocuments(
  docs: Document[],
): Promise<Document[]> {
  if (!docs.length) return [];

  const chunks = await splitter.splitDocuments(docs);

  const normalized: Document[] = [];
  for (const [index, chunk] of chunks.entries()) {
    const content = chunk.pageContent.trim();
    if (!content) continue;
    normalized.push(
      new Document({
        pageContent: content,
        metadata: {
          ...chunk.metadata,
          chunk_index:
            typeof chunk.metadata?.chunk_index === "number"
              ? chunk.metadata.chunk_index
              : index,
        },
      }),
    );
  }

  return normalized;
}
