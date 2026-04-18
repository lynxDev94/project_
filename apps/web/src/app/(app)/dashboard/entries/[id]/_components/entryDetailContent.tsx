import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import type { EntryDetailContentProps } from "../../types";

export function EntryDetailContent({
  entry,
  onDeleteClick,
}: EntryDetailContentProps) {
  return (
    <div className="border-dashboard-stroke shadow-card-layered min-w-0 max-w-full rounded-2xl border bg-white p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            {formatDateTime(entry.created_at)}
          </p>
          <h1 className="font-headline mt-2 max-w-full break-words text-3xl font-bold text-slate-900 md:text-4xl">
            {entry.title || "Untitled reflection"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/journal?edit=${entry.id}`}>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              aria-label="Edit entry"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
            aria-label="Delete entry"
            onClick={onDeleteClick}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {entry.tags?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 capitalize"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="prose prose-slate mt-8 max-w-none min-w-0 [overflow-wrap:anywhere]">
        {(entry.body || "")
          .split("\n\n")
          .filter(Boolean)
          .map((paragraph, i) => (
            <p
              key={i}
              className="mb-4 max-w-full break-words text-base leading-relaxed text-slate-700"
            >
              {paragraph}
            </p>
          ))}
        {!entry.body?.trim() && (
          <p className="text-slate-500 italic">No content</p>
        )}
      </div>
    </div>
  );
}
