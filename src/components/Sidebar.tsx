"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Rss,
  Users,
  Rocket,
  MessageSquare,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/feed" },
  { label: "Feed", icon: Rss, href: "/feed" },
  { label: "Founders", icon: Users, href: "/feed" },
  { label: "Startups", icon: Rocket, href: "/feed" },
  { label: "Messages", icon: MessageSquare, href: "/feed" },
  { label: "Notifications", icon: Bell, href: "/feed" },
  { label: "Settings", icon: Settings, href: "/feed" },
];

export default function Sidebar({
  user,
}: {
  user: { name: string; username: string; avatarUrl: string } | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="hidden w-[84px] flex-col items-center border-r border-white/5 bg-ink-950/90 py-6 lg:flex xl:w-56 xl:items-stretch xl:px-4">
      <Link href="/" className="mb-8 flex items-center gap-2 xl:px-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-gradient font-display text-lg font-bold text-ink-950">
          F
        </span>
        <span className="hidden font-display text-sm font-semibold tracking-wide xl:inline">
          FOUNDERS HOOK
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.label === "Home" || item.label === "Feed"
            ? pathname === "/feed"
            : false;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors xl:px-3 ${
                active
                  ? "bg-gold-400/10 text-gold-200"
                  : "text-mist-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={19} className="shrink-0" />
              <span className="hidden xl:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div ref={menuRef} className="relative mt-4">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors hover:bg-white/5"
        >
          <Image
            src={user?.avatarUrl || "https://picsum.photos/seed/user/64/64"}
            alt={user?.name || "You"}
            width={34}
            height={34}
            className="rounded-full border border-white/10 object-cover"
          />
          <span className="hidden min-w-0 flex-1 xl:block">
            <span className="block truncate text-sm font-medium text-white">
              {user?.name || "Guest"}
            </span>
            <span className="block truncate text-xs text-mist-500">Founder</span>
          </span>
          <ChevronDown size={15} className="hidden shrink-0 text-mist-500 xl:block" />
        </button>

        {menuOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-ink-850 shadow-card">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-mist-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut size={15} /> Log out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
