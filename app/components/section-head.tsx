/**
 * "[03] /work ------------- 4 results" strip at the top of a section.
 * Decorative wayfinding: each section carries its own real heading.
 */
export function SectionHead({ index, name, meta }: { index: string; name: string; meta?: string }) {
  return (
    <div className="sec-head" aria-hidden="true">
      <span className="sec-head__idx">[{index}]</span>
      <span className="sec-head__name">/{name}</span>
      <span className="sec-head__rule" />
      {meta ? <span className="sec-head__meta">{meta}</span> : null}
    </div>
  );
}
