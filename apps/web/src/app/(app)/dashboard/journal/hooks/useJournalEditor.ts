import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreditsContext } from "@/providers/Credits";
import { countJournalWords } from "@/lib/journal-word-count";
import { MIN_WORDS_FOR_ANALYSIS } from "@/lib/constants";
import { PROMPT_CATEGORIES } from "../deps";
import { shuffleArray } from "@/lib/utils";
import { analyzeJournalEntry, fetchJournalEntryById, persistJournalEntry } from "../api";
import type { JournalTag } from "../types";
import type { JungianAnalysisResult } from "@/components/journal/AiAnalysisModal";

export function useJournalEditor(editId: string | null) {
  const router = useRouter();
  const {
    credits,
    loading: creditsLoading,
    refreshCredits,
  } = useCreditsContext();
  const canAnalyzeCredits = !creditsLoading && credits !== null && credits >= 1;
  const [title, setTitle] = useState("Untitled reflection");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<JournalTag[]>([]);
  const [newTag, setNewTag] = useState("");
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [referencePrompt, setReferencePrompt] = useState<string | null>(null);
  const [shuffledCategories, setShuffledCategories] =
    useState(PROMPT_CATEGORIES);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(!!editId);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(editId);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<JungianAnalysisResult | null>(null);
  const entryDateRef = useRef<string>(new Date().toISOString().slice(0, 10));
  const lastSavedRef = useRef<{
    title: string;
    body: string;
    tags: string[];
  } | null>(null);

  useEffect(() => {
    setActiveEntryId(editId);
    if (!editId) {
      setEditLoading(false);
      return;
    }
    let cancelled = false;
    void fetchJournalEntryById(editId)
      .then((entry) => {
        if (!cancelled && entry) {
          setActiveEntryId(entry.id);
          setTitle(entry.title || "Untitled reflection");
          setBody(entry.body || "");
          setTags(
            (entry.tags ?? []).map((label: string) => ({
              id: `tag-${label}`,
              label,
            })),
          );
          entryDateRef.current =
            entry.entry_date || new Date().toISOString().slice(0, 10);
          lastSavedRef.current = {
            title: entry.title || "Untitled reflection",
            body: entry.body || "",
            tags: entry.tags ?? [],
          };
        }
      })
      .finally(() => {
        if (!cancelled) setEditLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [editId]);

  const wordCount = countJournalWords(body);
  const canAnalyzeLength = wordCount >= MIN_WORDS_FOR_ANALYSIS;
  const canAnalyze = canAnalyzeCredits && canAnalyzeLength;

  const tagLabels = tags.map((t) => t.label);
  const hasContent = title.trim() || body.trim();
  const isDirty =
    lastSavedRef.current === null
      ? Boolean(hasContent)
      : title !== lastSavedRef.current.title ||
        body !== lastSavedRef.current.body ||
        JSON.stringify([...tagLabels].sort()) !==
          JSON.stringify([...lastSavedRef.current.tags].sort());
  const isSaved = lastSavedRef.current !== null;

  const statusText =
    !isSaved && hasContent
      ? "Unsaved"
      : isSaved && !isDirty
        ? "Saved"
        : isSaved && isDirty
          ? "Unsaved changes"
          : "—";

  const handleShuffleSuggestions = useCallback(() => {
    const shuffled = shuffleArray(PROMPT_CATEGORIES).map((cat) => ({
      ...cat,
      prompts: shuffleArray(cat.prompts),
    }));
    setShuffledCategories(shuffled);
    setSelectedPrompt(null);
  }, []);

  const handleApplyPrompt = useCallback(() => {
    if (selectedPrompt) {
      setReferencePrompt(selectedPrompt);
      setPromptModalOpen(false);
      setSelectedPrompt(null);
    }
  }, [selectedPrompt]);

  const removeTag = (id: string) => {
    setTags((t) => t.filter((tag) => tag.id !== id));
  };

  const addTag = () => {
    if (!newTag.trim()) return;
    const label = newTag.trim().toLowerCase();
    if (tags.some((t) => t.label === label)) return;
    setTags((t) => [...t, { id: String(Date.now()), label }]);
    setNewTag("");
  };

  const persistEntry = useCallback(async () => {
    const payload = {
      title: title.trim() || "Untitled reflection",
      body,
      tags: tagLabels,
      entryDate: entryDateRef.current,
    };
    const savedId = await persistJournalEntry({
      id: activeEntryId ?? editId,
      payload,
    });
    setActiveEntryId(savedId);
    lastSavedRef.current = { title, body, tags: tagLabels };
    return savedId;
  }, [activeEntryId, body, editId, tagLabels, title]);

  const handleSaveEntry = async () => {
    setSaveLoading(true);
    try {
      const savedId = await persistEntry();
      router.push(`/dashboard/entries/${savedId}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!body.trim() || !canAnalyze) return;
    setAnalysisOpen(true);
    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    try {
      let entryId = activeEntryId ?? editId;
      if (!entryId) {
        entryId = await persistEntry();
        router.replace(`/dashboard/journal?edit=${entryId}`);
      }

      const data = await analyzeJournalEntry(entryId);
      void refreshCredits();
      setAnalysisResult({
        ...data.analysis,
        lowConfidence: Boolean(data.lowConfidence),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to run analysis";
      setAnalysisError(message);
    } finally {
      setAnalysisLoading(false);
    }
  };

  return {
    credits,
    creditsLoading,
    title,
    setTitle,
    body,
    setBody,
    tags,
    newTag,
    setNewTag,
    promptModalOpen,
    setPromptModalOpen,
    selectedPrompt,
    setSelectedPrompt,
    referencePrompt,
    setReferencePrompt,
    shuffledCategories,
    saveLoading,
    editLoading,
    analysisOpen,
    setAnalysisOpen,
    analysisLoading,
    analysisError,
    analysisResult,
    wordCount,
    canAnalyze,
    statusText,
    handleShuffleSuggestions,
    handleApplyPrompt,
    removeTag,
    addTag,
    handleSaveEntry,
    handleAnalyze,
  };
}
