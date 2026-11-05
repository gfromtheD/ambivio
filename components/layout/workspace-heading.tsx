export function WorkspaceHeading({ title, description, action }: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 pb-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 max-w-2xl">
        <h1 className="font-heading text-title font-medium text-balance">{title}</h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
