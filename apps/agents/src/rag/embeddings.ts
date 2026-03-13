import { OpenAIEmbeddings } from "@langchain/openai";

let embeddingsSingleton: OpenAIEmbeddings | null = null;

export function getEmbeddingsModel() {
  const openAIApiKey = process.env.OPENAI_API_KEY;
  if (!openAIApiKey) {
    throw new Error("Missing OPENAI_API_KEY for embeddings");
  }

  if (!embeddingsSingleton) {
    embeddingsSingleton = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      openAIApiKey,
    });
  }

  return embeddingsSingleton;
}
