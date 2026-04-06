import type { AnalyzeJournalResponse, JournalEntry } from "./types";

export async function fetchJournalEntryById(id: string): Promise<JournalEntry | null> {
  const response = await fetch(`/api/entries/${id}`);
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data?.entry ?? null;
}

type PersistJournalInput = {
  id: string | null;
  payload: {
    title: string;
    body: string;
    tags: string[];
    entryDate: string;
  };
};

export async function persistJournalEntry({
  id,
  payload,
}: PersistJournalInput): Promise<string> {
  const url = id ? `/api/entries/${id}` : "/api/entries";
  const method = id ? "PATCH" : "POST";
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok || !data?.entry?.id) {
    throw new Error(data?.error || "Could not save entry");
  }

  return String(data.entry.id);
}

export async function analyzeJournalEntry(
  id: string,
): Promise<AnalyzeJournalResponse> {
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
