type DashboardHeaderProps = {
  greetingName: string;
  archetypeLabel?: string | null;
};

export function DashboardHeader({
  greetingName,
  archetypeLabel,
}: DashboardHeaderProps) {
  return (
    <>
      <h1 className="font-headline mb-2 text-3xl font-bold text-slate-800 md:text-4xl">
        Good morning, {greetingName}
        {archetypeLabel ? ` — ${archetypeLabel}` : ""}.
      </h1>
      <p className="mb-8 text-lg text-slate-600">
        Where shall we go within today?
      </p>
    </>
  );
}
