import { cn } from "@/lib/utils";

export function AmbivioMark({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span className={cn("inline-flex items-center", className)} {...props}>
      <span className="font-heading text-[1.7rem] font-medium leading-none tracking-[-0.07em]">ambivio</span>
    </span>
  );
}
