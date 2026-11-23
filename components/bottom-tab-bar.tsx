"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatedText } from "@/components/animated-text";
import { isActive, navItems } from "@/components/nav-items";
import { useContent } from "@/lib/i18n/locale-context";

export function BottomTabBar() {
  const pathname = usePathname();
  const { ui } = useContent();

  return (
    <nav
      aria-label={ui.nav.primaryAria}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-zinc-950/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg sm:hidden"
    >
      <div className="grid grid-cols-5">
        {navItems.map((item) => {
          const active = isActive(item.path, pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.path}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400/50 ${
                active ? "text-emerald-400" : "text-zinc-500"
              }`}
            >
              <Icon className="size-5" />
              <AnimatedText text={ui.nav[item.key]} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
