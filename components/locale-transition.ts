/**
 * Marks the moment the visitor switches language so AnimatedText knows a text
 * change is a deliberate locale switch (animate) rather than the initial
 * preference being applied after hydration (swap silently).
 *
 * Switching is now a pure client state change with no navigation, so a plain
 * module variable is the right lifetime: it survives in-app navigation and
 * resets on a full page load (no animation on cold visits).
 */

let switchAt = 0;

/** Called by the language toggle the instant a new locale is chosen. */
export function markLocaleSwitch(): void {
  switchAt = Date.now();
}

/** True briefly after a toggle, while the new locale's text renders. */
export function isRecentLocaleSwitch(windowMs = 1500): boolean {
  return Date.now() - switchAt < windowMs;
}
