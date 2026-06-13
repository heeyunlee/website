/**
 * Shared client-side state for animating text across a locale switch.
 *
 * Switching locales navigates to a new URL, which remounts the page tree —
 * so components can't see their text change via props. Instead, AnimatedText
 * instances register their current string by a stable id; the language
 * toggle marks the switch; and after navigation the freshly mounted
 * instances look up what they used to say and animate from it.
 *
 * Module state survives client-side navigation but not a full page load —
 * exactly the lifetime we want (no animation on cold loads).
 */

const registry = new Map<string, string>();

let switchAt = 0;

/** Called by the language toggle just before navigation. */
export function markLocaleSwitch(): void {
  switchAt = Date.now();
}

/** True shortly after a toggle click, while the new locale page mounts. */
export function isRecentLocaleSwitch(windowMs = 1500): boolean {
  return Date.now() - switchAt < windowMs;
}

export function register(id: string, text: string): void {
  registry.set(id, text);
}

export function getPrevious(id: string): string | undefined {
  return registry.get(id);
}
