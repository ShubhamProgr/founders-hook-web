"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { timeAgo } from "@/lib/timeAgo";

const CATEGORY_COLORS: Record<string, string> = {
  "Startup Growth": "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  Fundraising: "bg-sky-400/10 text-sky-300 border-sky-400/20",
  Productivity: "bg-fuchsia-400/10 text-fuchsia-300 border-fuchsia-400/20",
  Marketing: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  Operations: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
};

export type PostDTO = {
  _id: string;
  title: string;
  category: string;
  excerpt: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
};

export default function PostCard({ post }: { post: PostDTO }) {
  const [saved, setSaved] = useState(false);
  const colorClass =
    CATEGORY_COLORS[post.category] ||
    "bg-gold-400/10 text-gold-300 border-gold-400/20";

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="flex w-64 shrink-0 snap-start flex-col rounded-2xl border border-white/10 bg-ink-850 p-4 shadow-card"
    >
      <div className="flex items-start justify-between">
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${colorClass}`}>
          {post.category}
        </span>
        <button
          onClick={() => setSaved((s) => !s)}
          className={`transition-colors ${saved ? "text-gold-300" : "text-mist-500 hover:text-white"}`}
          aria-label="Save"
        >
          <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <h4 className="mt-3 line-clamp-2 font-display text-sm font-semibold leading-snug text-white">
        {post.title}
      </h4>
      <p className="mt-1.5 line-clamp-2 flex-1 text-xs text-mist-400">
        {post.excerpt}
      </p>

      <div className="mt-4 flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.authorAvatar}
          alt={post.authorName}
          className="h-6 w-6 rounded-full object-cover"
        />
        <div className="leading-tight">
          <p className="text-xs font-medium text-mist-200">{post.authorName}</p>
          <p className="text-[11px] text-mist-500">{timeAgo(post.createdAt)}</p>
        </div>
      </div>
    </motion.div>
  );
}
