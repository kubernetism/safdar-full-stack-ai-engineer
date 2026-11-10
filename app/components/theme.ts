export type Theme = "light" | "dark";

export const THEME_KEY = "theme";

/**
 * Runs in <head> before first paint: stored choice, else the system setting.
 * Always sets data-theme, so CSS and the toggle know the resolved theme.
 */
export const THEME_BOOT_SCRIPT = `(function(){var t;try{t=localStorage.getItem("${THEME_KEY}")}catch(e){}if(t!=="light"&&t!=="dark"){t=window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.setAttribute("data-theme",t)})()`;
