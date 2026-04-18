import { getEmbeddingsModel } from "./embeddings.js";
import { getSupabaseClient } from "../security/supabase-client.js";

export interface JungianCitation {
  id: string;
  source: string;
  chunkId: number;
  preview: string;
  similarity: number;
}

export async function retrieveJungianContexts(
  query: string,
  topK = 4,
): Promise<{ confidence: number; contexts: JungianCitation[] }> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return { confidence: 0, contexts: [] };
  }

  const embeddings = getEmbeddingsModel();
  const vector = await embeddings.embedQuery(trimmedQuery);

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("match_jungian_chunks", {
    query_embedding: vector,
    match_count: topK,
  });

  if (error) {
    throw new Error(`Jungian retrieval failed: ${error.message}`);
  }

  const rows = Array.isArray(data) ? data : [];
  type RpcRow = {
    id?: unknown;
    content?: unknown;
    source?: unknown;
    chunk_index?: unknown;
    similarity?: unknown;
  };
  const contexts: JungianCitation[] = rows.map((item: RpcRow) => {
    const previewText =
      typeof item.content === "string" ? item.content.trim() : "";
    return {
      id: String(item.id),
      source: String(item.source ?? "unknown_source"),
      chunkId: Number(item.chunk_index ?? 0),
      preview:
        previewText.length > 420
          ? `${previewText.slice(0, 420)}...`
          : previewText,
      similarity: Number(item.similarity ?? 0),
    };
  });

  const confidence = contexts.length
    ? Number(
        Math.max(
          0,
          Math.min(
            1,
            contexts.reduce(
              (best, context) => Math.max(best, context.similarity),
              0,
            ),
          ),
        ).toFixed(2),
      )
    : 0;

  return {
    confidence,
    contexts,
  };
}
