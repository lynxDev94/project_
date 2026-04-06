import type { JungianAnalysisResult } from "@/components/journal/AiAnalysisModal";
import type { LucideIcon } from "lucide-react";

export type JournalTag = {
  id: string;
  label: string;
};

export type PromptCategory = {
  id: string;
  title: string;
  icon: LucideIcon;
  prompts: string[];
};

export type JournalEntry = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  entry_date: string;
};

export type AnalyzeJournalResponse = {
  analysis: JungianAnalysisResult;
  lowConfidence?: boolean;
};
