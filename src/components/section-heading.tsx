import { cn } from "@/lib/utils";
import { RevealText } from "@/components/reveal-text";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "font-mono text-xs uppercase tracking-[0.2em] mb-3",
            dark ? "text-brass-bright" : "text-ember"
          )}
        >
          {eyebrow}
        </p>
      )}
      <RevealText
        as="h2"
        text={title}
        className={cn(
          "font-display text-3xl sm:text-4xl leading-tight",
          dark ? "text-cream" : "text-ink"
        )}
      />
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            dark ? "text-cream/80" : "text-ink/85"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
