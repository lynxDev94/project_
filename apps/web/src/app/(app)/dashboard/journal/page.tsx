"use client";

import { useSearchParams } from "next/navigation";
import { AiAnalysisModal } from "@/components/journal/AiAnalysisModal";
import { JournalEditorPane } from "./_components/journalEditorPane";
import { JournalHeader } from "./_components/journalHeader";
import { JournalSidebar } from "./_components/journalSidebar";
import { PromptIdeasDialog } from "./_components/promptIdeasDialog";
import { useJournalEditor } from "./hooks/useJournalEditor";

export default function JournalPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const {
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
  } = useJournalEditor(editId);

  if (editLoading) {
    return (
      <div className="mx-auto max-w-6xl font-sans text-slate-800">
        <div className="flex h-64 items-center justify-center">
          <div className="border-brand h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl font-sans text-slate-800">
      <JournalHeader isEdit={Boolean(editId)} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2.3fr)_minmax(280px,1fr)]">
        <JournalEditorPane
          title={title}
          body={body}
          referencePrompt={referencePrompt}
          wordCount={wordCount}
          statusText={statusText}
          canAnalyze={canAnalyze}
          saveLoading={saveLoading}
          editLoading={editLoading}
          analysisLoading={analysisLoading}
          isEdit={Boolean(editId)}
          onTitleChange={setTitle}
          onBodyChange={setBody}
          onOpenPrompts={() => setPromptModalOpen(true)}
          onClearReferencePrompt={() => setReferencePrompt(null)}
          onAnalyze={handleAnalyze}
          onSave={handleSaveEntry}
        />

        <JournalSidebar
          creditsLoading={creditsLoading}
          credits={credits}
          tags={tags}
          newTag={newTag}
          onNewTagChange={setNewTag}
          onAddTag={addTag}
          onRemoveTag={removeTag}
        />
      </div>

      <PromptIdeasDialog
        open={promptModalOpen}
        onOpenChange={(open: boolean) => {
          setPromptModalOpen(open);
          if (!open) setSelectedPrompt(null);
        }}
        selectedPrompt={selectedPrompt}
        categories={shuffledCategories}
        onSelectPrompt={setSelectedPrompt}
        onShuffle={handleShuffleSuggestions}
        onApply={handleApplyPrompt}
      />

      <AiAnalysisModal
        open={analysisOpen}
        onOpenChange={setAnalysisOpen}
        loading={analysisLoading}
        error={analysisError}
        result={analysisResult}
      />
    </div>
  );
}
