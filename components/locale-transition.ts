/**
 * Shared client-side state for animating text across a locale switch.
 *
 * Switching locales is a soft client navigation: the `[locale]` param changes
 * and AnimatedText instances get a new `text` prop *in place* (they are not
 * remounted). So an instance can compare what it now says against what it said
 * before and animate the difference. The registry holds, per stable id, the
 * text currently shown — read as "previous" by any instance that does remount
 * (e.g. a page swap) so it still animates from the right string.
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

/** True shortly after a toggle click, while the new locale renders. */
export function isRecentLocaleSwitch(windowMs = 1500): boolean {
  return Date.now() - switchAt < windowMs;
}

export function register(id: string, text: string): void {
  registry.set(id, text);
}

export function getPrevious(id: string): string | undefined {
  return registry.get(id);
}
