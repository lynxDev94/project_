"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface AnalysisCitation {
  source: string;
  chunkId: number;
  preview: string;
}

export interface JungianAnalysisResult {
  reflection: string;
  jungianThemes: string[];
  interpretation: string;
  deepQuestions: string[];
  shadowExercise: string;
  citations: AnalysisCitation[];
  lowConfidence?: boolean;
}

interface AiAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  error: string | null;
  result: JungianAnalysisResult | null;
}

export function AiAnalysisModal({
  open,
  onOpenChange,
  loading,
  error,
  result,
}: AiAnalysisModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl">
        <DialogHeader>
          <DialogTitle>AI Analysis</DialogTitle>
          <DialogDescription>
            Jungian reflection grounded in your local knowledge sources.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto pr-3">
          {loading && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
              Running analysis...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && result && (
            <div className="space-y-5 pb-1 text-sm text-slate-700">
              <section className="space-y-2">
                <h3 className="text-base font-semibold text-slate-900">1. Reflection</h3>
                <p>{result.reflection}</p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-slate-900">2. Likely Jungian Themes</h3>
                <ul className="list-disc space-y-1 pl-5">
                  {result.jungianThemes.map((theme) => (
                    <li key={theme}>{theme}</li>
                  ))}
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-slate-900">
                  3. Jungian Interpretation (with uncertainty)
                </h3>
                <p>{result.interpretation}</p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-slate-900">4. Deep Questions</h3>
                <ul className="list-disc space-y-1 pl-5">
                  {result.deepQuestions.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-slate-900">5. Shadow-Work Exercise</h3>
                <p>{result.shadowExercise}</p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-slate-900">Citations</h3>
                {result.citations.length === 0 ? (
                  <p className="text-slate-500">No source citations returned.</p>
                ) : (
                  <div className="space-y-2">
                    {result.citations.map((citation) => (
                      <div
                        key={`${citation.source}-${citation.chunkId}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                      >
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {citation.source} #{citation.chunkId}
                        </p>
                        <p className="text-xs leading-relaxed text-slate-600">
                          {citation.preview}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {result.lowConfidence && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  Retrieval confidence is low. Treat interpretation as tentative.
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
