import "react";

// Allow CSS custom properties (style={{ "--d": "1.2s" }}) without casts.
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
