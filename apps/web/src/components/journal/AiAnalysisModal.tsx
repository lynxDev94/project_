"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Brain, MoonStar, Quote, Sparkles } from "lucide-react";

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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="border-brand/30 from-background-dark via-surface-dark to-background-dark-alt max-h-[90vh] max-w-4xl overflow-hidden border bg-linear-to-br p-0 text-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <DialogHeader className="border-brand/20 border-b bg-black/20 px-6 py-5">
          <p className="text-brand/80 mb-1 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase">
            <MoonStar className="h-3.5 w-3.5" />
            AI Psychological Synthesis
          </p>
          <DialogTitle className="text-3xl text-slate-100">
            Jungian interpretation
          </DialogTitle>
          {/* <DialogDescription className="text-slate-300">
            Jungian interpretation
          </DialogDescription> */}
        </DialogHeader>

        <div className="max-h-[72vh] overflow-y-auto px-6 py-5">
          {loading && (
            <div className="border-brand/30 bg-brand/10 flex items-center gap-3 rounded-xl border p-4 text-sm text-slate-200">
              <div className="border-brand h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              Running analysis...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-300/40 bg-red-950/40 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          {!loading && !error && result && (
            <div className="space-y-5 pb-1 text-sm text-slate-200">
              <section className="border-brand/25 space-y-2 rounded-xl border bg-white/[0.04] p-4">
                <h3 className="inline-flex items-center gap-2 text-base font-semibold text-slate-100">
                  {/* <Brain className="text-brand h-4 w-4" /> */}
                  1. Reflection
                </h3>
                <p className="leading-relaxed text-slate-200">
                  {result.reflection}
                </p>
              </section>

              <section className="border-brand/25 space-y-2 rounded-xl border bg-white/[0.03] p-4">
                <h3 className="text-base font-semibold text-slate-100">
                  2. Likely Jungian Themes
                </h3>
                <ul className="list-disc space-y-1 pl-5">
                  {result.jungianThemes.map((theme) => (
                    <li
                      key={theme}
                      className="text-slate-200"
                    >
                      {theme}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="border-brand/25 space-y-2 rounded-xl border bg-white/[0.03] p-4">
                <h3 className="text-base font-semibold text-slate-100">
                  3. Jungian Interpretation
                </h3>
                <p className="leading-relaxed text-slate-200">
                  {result.interpretation}
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-brand/80 text-center text-xs font-semibold tracking-[0.2em] uppercase">
                  The Deepening
                </h3>
                <ul className="space-y-2">
                  {result.deepQuestions.map((question) => (
                    <li
                      key={question}
                      className="border-brand/30 bg-brand-deep/50 relative rounded-xl border p-4 pr-10 text-slate-100"
                    >
                      {question}
                      <Quote className="text-brand/60 absolute right-3 bottom-3 h-4 w-4" />
                    </li>
                  ))}
                </ul>
              </section>

              <section className="border-brand/30 bg-brand/10 space-y-2 rounded-xl border p-4">
                <h3 className="inline-flex items-center gap-2 text-base font-semibold text-slate-100">
                  <Sparkles className="text-brand h-4 w-4" />
                  Shadow-Work Exercise
                </h3>
                <p className="leading-relaxed text-slate-100">
                  {result.shadowExercise}
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-slate-100">
                  Citations
                </h3>
                {result.citations.length === 0 ? (
                  <p className="text-slate-400">
                    No source citations returned.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {result.citations.map((citation) => (
                      <div
                        key={`${citation.source}-${citation.chunkId}`}
                        className="border-brand/20 rounded-lg border bg-black/25 p-3"
                      >
                        {/* <p className="text-brand/80 mb-1 text-xs font-semibold tracking-wide uppercase">
                          {citation.source} #{citation.chunkId}
                        </p> */}
                        <p className="text-xs leading-relaxed text-slate-300">
                          {citation.preview}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {result.lowConfidence && (
                <div className="rounded-lg border border-amber-300/40 bg-amber-950/40 p-3 text-xs text-amber-200">
                  Retrieval confidence is low. Treat this interpretation as
                  tentative.
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
