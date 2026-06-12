"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard unavailable (http, permissions) — the mailto link next to
      // this button still works.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-umami-event="copy-email"
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-zinc-300 transition-colors hover:border-emerald-400/30 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
    >
      {copied ? (
        <CheckIcon className="size-4 text-emerald-400" />
      ) : (
        <CopyIcon className="size-4" />
      )}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
