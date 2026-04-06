import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, EyeOff, Lightbulb, PenLine, Sparkles, X } from "lucide-react";

type JournalEditorPaneProps = {
  title: string;
  body: string;
  referencePrompt: string | null;
  wordCount: number;
  statusText: string;
  canAnalyze: boolean;
  saveLoading: boolean;
  editLoading: boolean;
  analysisLoading: boolean;
  isEdit: boolean;
  onTitleChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onOpenPrompts: () => void;
  onClearReferencePrompt: () => void;
  onAnalyze: () => void;
  onSave: () => void;
};

export function JournalEditorPane({
  title,
  body,
  referencePrompt,
  wordCount,
  statusText,
  canAnalyze,
  saveLoading,
  editLoading,
  analysisLoading,
  isEdit,
  onTitleChange,
  onBodyChange,
  onOpenPrompts,
  onClearReferencePrompt,
  onAnalyze,
  onSave,
}: JournalEditorPaneProps) {
  return (
    <div className="group border-dashboard-stroke shadow-card-layered flex min-h-[440px] flex-col overflow-hidden rounded-3xl border bg-white transition-shadow focus-within:shadow-[0_0_0_1px_rgba(108,43,238,0.15),0_4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="relative flex-1 px-6 pt-6 pb-4 md:px-8 md:pt-7">
        <div className="absolute top-6 right-4 flex items-center gap-1 md:right-6">
          <button
            type="button"
            onClick={onOpenPrompts}
            className="hover:bg-brand/10 hover:text-brand flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors"
            aria-label="Open prompt ideas"
          >
            <Lightbulb className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Private entry"
          >
            <EyeOff className="h-4 w-4" />
          </button>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled reflection"
          className="font-headline mb-3 w-[calc(100%-2rem)] pr-2 text-2xl font-semibold tracking-tight text-slate-900 placeholder:text-slate-300 focus:outline-none md:text-3xl"
        />
        <p className="mb-5 text-sm text-slate-400 italic">
          Begin your journey into the subconscious. Describe the dream, memory,
          or feeling that keeps returning to you.
        </p>
        {referencePrompt && (
          <div className="border-brand/20 bg-brand/5 mb-5 flex items-start gap-3 rounded-xl border p-4">
            <PenLine className="text-brand mt-0.5 h-4 w-4 shrink-0" />
            <p className="flex-1 text-sm font-medium text-slate-700">
              {referencePrompt}
            </p>
            <button
              type="button"
              onClick={onClearReferencePrompt}
              className="hover:bg-brand/10 rounded p-1 text-slate-400 hover:text-slate-600"
              aria-label="Remove reference prompt"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <Textarea
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          placeholder="Describe the dream or the feeling that lingers in the corners of your mind..."
          className="min-h-[240px] w-full resize-none border-0 bg-transparent p-0 text-base leading-[1.7] text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 md:min-h-[320px]"
        />
      </div>

      <div className="border-dashboard-stroke flex flex-wrap items-center justify-between gap-4 border-t bg-slate-50/90 px-6 py-3.5 md:px-8">
        <div className="flex items-center gap-6 text-sm">
          <div>
            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Words
            </p>
            <p className="text-sm font-medium text-slate-700">{wordCount} words</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Status
            </p>
            <p
              className={`flex items-center gap-2 text-sm font-medium ${
                statusText === "Saved"
                  ? "text-emerald-600"
                  : statusText === "Unsaved" || statusText === "Unsaved changes"
                    ? "text-amber-600"
                    : "text-slate-500"
              }`}
            >
              {statusText !== "—" && (
                <span
                  className={`h-2 w-2 rounded-full ${
                    statusText === "Saved" ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
              )}
              {statusText}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            className="bg-brand hover:bg-brand/90 gap-2 rounded-xl px-6 text-white shadow-sm"
            onClick={onAnalyze}
            disabled={
              analysisLoading || saveLoading || editLoading || !body.trim() || !canAnalyze
            }
          >
            <Sparkles className="h-4 w-4" />
            {analysisLoading ? "Analyzing..." : "Analyze with AI"}
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="bg-brand hover:bg-brand/90 gap-2 rounded-xl px-6 text-white shadow-sm"
            onClick={onSave}
            disabled={saveLoading || editLoading || !body.trim()}
          >
            <Check className="h-4 w-4" />
            {saveLoading ? "Saving..." : isEdit ? "Update Entry" : "Save Entry"}
          </Button>
        </div>
      </div>
    </div>
  );
}
