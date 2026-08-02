"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Search,
  PenSquare,
  Plus,
  X,
  Loader2,
  Sparkles,
  Calendar,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { timeAgo } from "@/lib/timeAgo";

interface Post {
  _id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
}

const CATEGORIES = [
  "All",
  "Startup Growth",
  "Fundraising",
  "Productivity",
  "Marketing",
  "Operations",
  "Engineering",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Startup Growth": "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  Fundraising: "bg-sky-400/10 text-sky-300 border-sky-400/20",
  Productivity: "bg-fuchsia-400/10 text-fuchsia-300 border-fuchsia-400/20",
  Marketing: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  Operations: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
  Engineering: "bg-indigo-400/10 text-indigo-300 border-indigo-400/20",
};

export default function KnowledgeHubPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [readingPost, setReadingPost] = useState<Post | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Startup Growth");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [meRes, postsRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/posts"),
        ]);

        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentUser(meData.user);
        }

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData.posts || []);
        }
      } catch (err) {
        console.error("Failed to load knowledge hub data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) {
      setErrorMsg("Title and excerpt are required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          excerpt,
          content: content || excerpt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to publish article.");
      } else {
        setPosts((prev) => [data.post, ...prev]);
        setIsWriteModalOpen(false);
        setTitle("");
        setExcerpt("");
        setContent("");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong while publishing.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.authorName.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="flex min-h-screen bg-ink-950 text-mist-100">
      <Sidebar user={currentUser} />

      <main className="relative min-w-0 flex-1 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-28 pt-12 lg:px-10">
          {/* Header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-8">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/10 px-3 py-1 text-xs font-semibold text-gold-200">
                <BookOpen size={14} />
                Knowledge Base
              </div>
              <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                Knowledge Hub
              </h1>
              <p className="mt-1.5 text-sm text-mist-400">
                Insights, startup playbooks, and guides published by fellow founders.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative w-full max-w-xs sm:w-auto">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mist-500"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles or authors…"
                  className="field-input pl-11 pr-4"
                />
              </div>

              {/* Write Article Button */}
              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="btn-gold inline-flex items-center gap-2 px-4 py-2.5 text-sm shrink-0"
              >
                <PenSquare size={16} />
                Write Article
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex snap-x gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`snap-start rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-gold-gradient text-ink-950 shadow-sm"
                    : "border border-white/10 bg-white/5 text-mist-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-24 text-mist-400">
              <Loader2 size={24} className="animate-spin text-gold-300" />
              <span className="text-base font-medium">Loading articles…</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-white/10 bg-ink-900/40 px-6 py-16 text-center">
              <BookOpen size={40} className="mx-auto mb-3 text-mist-600" />
              <p className="text-lg font-medium text-mist-200">No articles found</p>
              <p className="mt-1 text-sm text-mist-500">
                Be the first to share your startup knowledge and insights with the community.
              </p>
              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="btn-gold mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs"
              >
                <Plus size={15} /> Write standard article
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => {
                const badgeColor =
                  CATEGORY_COLORS[post.category] ||
                  "bg-gold-400/10 text-gold-300 border-gold-400/20";
                return (
                  <div
                    key={post._id}
                    onClick={() => setReadingPost(post)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-ink-900/75 p-6 shadow-card backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-gold-500/30 hover:bg-ink-850 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${badgeColor}`}
                        >
                          {post.category}
                        </span>
                        <span className="text-[11px] text-mist-500">
                          {timeAgo(post.createdAt)}
                        </span>
                      </div>

                      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-white group-hover:text-gold-200 transition-colors">
                        {post.title}
                      </h3>

                      <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-mist-400">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.authorAvatar || "https://picsum.photos/seed/user/64/64"}
                        alt={post.authorName}
                        className="h-8 w-8 rounded-full object-cover border border-white/10"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-mist-200">
                          {post.authorName}
                        </p>
                        <p className="text-[10px] text-mist-500">Founder</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* WRITE ARTICLE MODAL */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-card my-8">
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-mist-400 hover:bg-white/5 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-300">
                <PenSquare size={19} />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-white">
                  Publish Knowledge Article
                </h2>
                <p className="text-xs text-mist-400">
                  Share startup guides, technical insights, or lessons learned.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist-400">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 5 Lessons from Scaling Our MVP to 10k Users"
                  className="field-input"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist-400">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="field-input bg-ink-950 cursor-pointer"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist-400">
                  Summary / Excerpt *
                </label>
                <textarea
                  required
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief 1-2 sentence overview of what this article covers..."
                  className="field-input resize-y"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mist-400">
                  Full Article Content
                </label>
                <textarea
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your article body here..."
                  className="field-input resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-mist-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 text-xs disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Publishing…
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      Publish Article
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* READING ARTICLE MODAL */}
      {readingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-ink-900 p-8 shadow-card my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setReadingPost(null)}
              className="absolute right-5 top-5 rounded-lg p-2 text-mist-400 hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="mb-4 inline-block">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  CATEGORY_COLORS[readingPost.category] ||
                  "bg-gold-400/10 text-gold-300 border-gold-400/20"
                }`}
              >
                {readingPost.category}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white leading-snug">
              {readingPost.title}
            </h1>

            <div className="my-6 flex items-center gap-3 border-y border-white/10 py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={readingPost.authorAvatar || "https://picsum.photos/seed/user/64/64"}
                alt={readingPost.authorName}
                className="h-10 w-10 rounded-full object-cover border border-white/10"
              />
              <div>
                <p className="text-sm font-semibold text-white">{readingPost.authorName}</p>
                <p className="flex items-center gap-2 text-xs text-mist-500">
                  <Calendar size={13} /> Published {timeAgo(readingPost.createdAt)}
                </p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-mist-200 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-wrap">
              {readingPost.content || readingPost.excerpt}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
