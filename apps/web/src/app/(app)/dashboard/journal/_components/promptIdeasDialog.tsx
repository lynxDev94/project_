import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PenLine, Shuffle } from "lucide-react";
import type { PromptCategory } from "../types";

type PromptIdeasDialogProps = {
  open: boolean;
  selectedPrompt: string | null;
  categories: PromptCategory[];
  onOpenChange: (open: boolean) => void;
  onSelectPrompt: (prompt: string | null) => void;
  onShuffle: () => void;
  onApply: () => void;
};

export function PromptIdeasDialog({
  open,
  selectedPrompt,
  categories,
  onOpenChange,
  onSelectPrompt,
  onShuffle,
  onApply,
}: PromptIdeasDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 pr-8">
            <div>
              <DialogTitle className="font-headline text-xl">
                Prompt Ideas
              </DialogTitle>
              <DialogDescription className="mt-1">
                Select a theme to guide your journaling session.
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2"
              onClick={onShuffle}
            >
              <Shuffle className="h-4 w-4" />
              Shuffle Suggestions
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-6 py-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="bg-brand/10 text-brand flex h-8 w-8 items-center justify-center rounded-lg">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="font-sans text-sm font-bold text-slate-800">
                    {category.title}
                  </h3>
                </div>
                <div className="space-y-2">
                  {category.prompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() =>
                        onSelectPrompt(selectedPrompt === prompt ? null : prompt)
                      }
                      className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                        selectedPrompt === prompt
                          ? "border-brand bg-brand/10 text-brand"
                          : "border-dashboard-stroke bg-slate-50/80 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter className="border-dashboard-stroke flex-row gap-2 border-t pt-4 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="bg-brand hover:bg-brand/90 gap-2 rounded-xl text-white"
            onClick={onApply}
            disabled={!selectedPrompt}
          >
            <PenLine className="h-4 w-4" />
            Apply to Journal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
