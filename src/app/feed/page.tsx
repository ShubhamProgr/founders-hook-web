"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  Plus,
  ChevronRight,
  Home,
  Rss,
  Users,
  Rocket,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import StartupCard, { StartupDTO } from "@/components/StartupCard";
import PostCard, { PostDTO } from "@/components/PostCard";
import CreateStartupModal from "@/components/CreateStartupModal";

type Me = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function FeedPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [startups, setStartups] = useState<StartupDTO[]>([]);
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [query, setQuery] = useState("");
  const [loadingStartups, setLoadingStartups] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const loadStartups = useCallback(async (q?: string) => {
    setLoadingStartups(true);
    const url = q ? `/api/startups?q=${encodeURIComponent(q)}` : "/api/startups";
    const res = await fetch(url);
    const data = await res.json();
    setStartups(data.startups || []);
    setLoadingStartups(false);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setMe(d.user));
    loadStartups();
    fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []));
  }, [loadStartups]);

  useEffect(() => {
    const t = setTimeout(() => loadStartups(query), 350);
    return () => clearTimeout(t);
  }, [query, loadStartups]);

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar user={me} />

      <div className="relative flex-1">
        <div className="absolute inset-x-0 top-0 h-72 overflow-hidden">
          <Image
            src="https://picsum.photos/seed/foundershook-feed/1800/500"
            alt=""
            fill
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-ink-950/80 to-ink-950" />
        </div>

        <main className="relative z-10 mx-auto max-w-6xl px-6 pb-28 pt-8 lg:px-10">
          {/* HEADER */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                {greeting()}{me?.name ? `, ${me.name.split(" ")[0]}` : ""} 👋
              </h1>
              <p className="mt-1 text-sm text-mist-400">
                Let&apos;s build something impactful today.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-xs">
                <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mist-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for founders or startups…"
                  className="field-input pl-11 pr-10"
                />
                <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-mist-500">
                  ⌘K
                </kbd>
              </div>
              <button className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-mist-300 hover:text-white">
                <Bell size={18} />
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-gold-400" />
              </button>
            </div>
          </div>

          {/* DISCOVER STARTUPS */}
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-white">
                Discover Impactful Startups
              </h2>
              <button
                onClick={() => setCreateOpen(true)}
                className="hidden items-center gap-1 text-sm font-medium text-gold-300 hover:text-gold-200 sm:flex"
              >
                Publish yours <ChevronRight size={15} />
              </button>
            </div>

            {loadingStartups ? (
              <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-64 w-72 shrink-0 animate-pulse rounded-2xl bg-white/5" />
                ))}
              </div>
            ) : startups.length === 0 ? (
              <EmptyState
                title="No startups yet"
                subtitle="Be the first founder to publish an idea."
                actionLabel="Publish a startup"
                onAction={() => setCreateOpen(true)}
              />
            ) : (
              <div className="flex snap-x gap-4 overflow-x-auto pb-3">
                {startups.map((s) => (
                  <StartupCard key={s._id} startup={s} />
                ))}
              </div>
            )}
          </section>

          {/* KNOWLEDGE HUB */}
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-white">
                Knowledge Hub
              </h2>
              <button className="flex items-center gap-1 text-sm font-medium text-gold-300 hover:text-gold-200">
                View all <ChevronRight size={15} />
              </button>
            </div>

            {posts.length === 0 ? (
              <EmptyState
                title="Nothing here yet"
                subtitle="Founder tips and guides will show up here as they're published."
              />
            ) : (
              <div className="flex snap-x gap-4 overflow-x-auto pb-3">
                {posts.map((p) => (
                  <PostCard key={p._id} post={p} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* MOBILE / BOTTOM BAR */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-center gap-1 border-t border-white/10 bg-ink-900/95 px-4 py-3 backdrop-blur lg:justify-center">
        <BottomIcon icon={Home} label="Home" />
        <button
          onClick={() => setCreateOpen(true)}
          className="btn-gold mx-2 !px-4 !py-2.5 text-xs"
        >
          <Plus size={15} /> Create Startup
        </button>
        <BottomIcon icon={Rss} label="Feed" />
        <BottomIcon icon={Users} label="Founders" />
        <BottomIcon icon={Rocket} label="Startups" />
        <BottomIcon icon={MessageSquare} label="Messages" />
        <button className="hidden h-10 w-10 items-center justify-center rounded-xl text-mist-400 hover:text-white sm:flex">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {createOpen && (
        <CreateStartupModal
          onClose={() => setCreateOpen(false)}
          onCreated={() => {
            setCreateOpen(false);
            loadStartups();
          }}
        />
      )}
    </div>
  );
}

function BottomIcon({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button
      className="flex h-10 w-10 flex-col items-center justify-center rounded-xl text-mist-400 transition-colors hover:text-white"
      title={label}
    >
      <Icon size={18} />
    </button>
  );
}

function EmptyState({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-8 py-10 text-center"
    >
      <p className="font-display text-base font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-mist-400">{subtitle}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-gold mt-4 !py-2 !px-5 text-xs">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
