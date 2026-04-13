import type { AnalyzeEntryResponse, Entry } from "./types";

export async function fetchEntryById(id: string): Promise<Entry | null> {
  const response = await fetch(`/api/entries/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Failed to load entry.");
  }

  const data = await response.json();
  return data?.entry ?? null;
}

export async function deleteEntryById(id: string): Promise<void> {
  const response = await fetch(`/api/entries/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to delete entry.");
  }
}

export async function analyzeEntryById(
  id: string,
): Promise<AnalyzeEntryResponse> {
  const response = await fetch(`/api/entries/${id}/analysis`, {
    method: "POST",
  });
  const data = await response.json();
  if (!response.ok || !data?.analysis) {
    throw new Error(
      (typeof data?.message === "string" && data.message) ||
        (typeof data?.error === "string" && data.error) ||
        "Analysis failed",
    );
  }

  return data;
}
