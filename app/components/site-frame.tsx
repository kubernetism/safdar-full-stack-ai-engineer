import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** Skip link, header, main landmark and footer shared by every route. */
export function SiteFrame({
  children,
  current,
  before,
}: {
  children: ReactNode;
  current?: "blog" | "patterns" | "fde";
  /** Rendered first in the body, e.g. the home intro overlay. */
  before?: ReactNode;
}) {
  return (
    <>
      {before}
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader current={current} />
      <div className="frame">
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
