import "dotenv/config";
import path from "node:path";
import { listKnowledgeFiles, loadKnowledgeSource } from "./loaders.js";
import { splitDocuments } from "./splitter.js";
import { getEmbeddingsModel } from "./embeddings.js";
import { getSupabaseClient } from "../security/supabase-client.js";

interface IngestStats {
  scanned: number;
  ingested: number;
  skipped: number;
  chunksUpserted: number;
}

function resolveKnowledgeDir() {
  if (process.env.JUNGIAN_KB_DIR) {
    return path.resolve(process.env.JUNGIAN_KB_DIR);
  }
  return path.resolve(process.cwd(), "knowledge", "jungian");
}

async function ingestSource(
  filePath: string,
  knowledgeDir: string,
): Promise<{ ingested: boolean; chunks: number }> {
  const sourceDoc = await loadKnowledgeSource(filePath, knowledgeDir);
  if (!sourceDoc) return { ingested: false, chunks: 0 };

  const supabase = getSupabaseClient();
  const { source, sourceHash } = sourceDoc;

  const { data: existingDoc, error: existingErr } = await supabase
    .from("jungian_documents")
    .select("id, source_hash")
    .eq("source", source)
    .maybeSingle();

  if (existingErr) {
    throw new Error(`Failed reading existing doc "${source}": ${existingErr.message}`);
  }

  if (existingDoc?.source_hash === sourceHash) {
    return { ingested: false, chunks: 0 };
  }

  const chunks = await splitDocuments(sourceDoc.docs);
  if (!chunks.length) return { ingested: false, chunks: 0 };

  const { data: documentRow, error: upsertDocErr } = await supabase
    .from("jungian_documents")
    .upsert(
      {
        source,
        source_hash: sourceHash,
      },
      { onConflict: "source" },
    )
    .select("id")
    .single();

  if (upsertDocErr || !documentRow) {
    throw new Error(
      `Failed upserting document "${source}": ${upsertDocErr?.message ?? "unknown"}`,
    );
  }

  const { error: deleteErr } = await supabase
    .from("jungian_chunks")
    .delete()
    .eq("source", source);

  if (deleteErr) {
    throw new Error(`Failed deleting previous chunks for "${source}": ${deleteErr.message}`);
  }

  const embeddings = getEmbeddingsModel();
  const texts = chunks.map((chunk) => chunk.pageContent);
  const vectors = await embeddings.embedDocuments(texts);

  const rows = chunks.map((chunk, index) => ({
    document_id: documentRow.id,
    source,
    chunk_index: index,
    content: chunk.pageContent,
    source_hash: sourceHash,
    embedding: vectors[index],
  }));

  const { error: upsertChunkErr } = await supabase
    .from("jungian_chunks")
    .upsert(rows, { onConflict: "source_hash,chunk_index" });

  if (upsertChunkErr) {
    throw new Error(
      `Failed upserting chunks for "${source}": ${upsertChunkErr.message}`,
    );
  }

  return {
    ingested: true,
    chunks: rows.length,
  };
}

async function run() {
  const knowledgeDir = resolveKnowledgeDir();
  const files = await listKnowledgeFiles(knowledgeDir);

  const stats: IngestStats = {
    scanned: files.length,
    ingested: 0,
    skipped: 0,
    chunksUpserted: 0,
  };

  for (const filePath of files) {
    try {
      const result = await ingestSource(filePath, knowledgeDir);
      if (result.ingested) {
        stats.ingested += 1;
        stats.chunksUpserted += result.chunks;
        console.log(`[ingest] upserted ${result.chunks} chunks from ${filePath}`);
      } else {
        stats.skipped += 1;
        console.log(`[ingest] skipped ${filePath}`);
      }
    } catch (error) {
      console.error(`[ingest] failed ${filePath}`, error);
      process.exitCode = 1;
    }
  }

  console.log(
    `[ingest] done scanned=${stats.scanned} ingested=${stats.ingested} skipped=${stats.skipped} chunks=${stats.chunksUpserted}`,
  );
}

run().catch((error) => {
  console.error("[ingest] fatal", error);
  process.exit(1);
});
