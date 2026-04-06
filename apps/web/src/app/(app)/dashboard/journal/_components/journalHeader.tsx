type JournalHeaderProps = {
  isEdit: boolean;
};

export function JournalHeader({ isEdit }: JournalHeaderProps) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
        Journal
      </p>
      <h1 className="font-headline mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
        {isEdit ? "Edit reflection" : "New reflection"}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Capture what surfaced today. You can always return to refine, annotate,
        or ask the AI to help you see patterns underneath the words.
      </p>
    </div>
  );
}
