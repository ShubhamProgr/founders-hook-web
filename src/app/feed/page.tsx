"use client";

import ProjectSetupModal from "@/components/ProjectSetupModal";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Bell, Plus, ChevronRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import StartupCard, { StartupDTO } from "@/components/StartupCard";
import PostCard, { PostDTO } from "@/components/PostCard";

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
  
  // This state now controls your new ProjectSetupModal
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

        <main className="relative z-10 mx-auto max-w-6xl px-6 pb-12 pt-8 lg:px-10">
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
              <button
                onClick={() => setCreateOpen(true)}
                className="btn-gold flex shrink-0 items-center gap-1.5 !px-4 !py-2.5 text-sm"
              >
                <Plus size={15} /> Create Startup
              </button>
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
              {/* Removed the empty Publish Yours button entirely from here */}
            </div>

            {loadingStartups ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/5" />
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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



      {createOpen && (
        <ProjectSetupModal
          onClose={() => {
            setCreateOpen(false);
            loadStartups();
          }}
        />
      )}
    </div>
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