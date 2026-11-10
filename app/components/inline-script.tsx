"use client";

/**
 * A script that runs during HTML parsing on hard loads only. On client
 * renders it becomes text/plain, so React never inserts a live script
 * (and does not warn about one). See the Next.js "Preventing Flash" guide.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
