import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-accent to-primary bg-clip-text text-transparent">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg">{description}</p>
      )}
    </div>
  );
}
