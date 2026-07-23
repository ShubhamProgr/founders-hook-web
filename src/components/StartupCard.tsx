"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import ApplyModal from "./ApplyModal";

export type StartupDTO = {
  _id: string;
  name: string;
  tagline: string;
  category: string;
  icon: string;
  coverImage: string;
  featured?: boolean;
  members: { _id: string; name: string; avatarUrl: string }[];
  openRoles: { _id: string; title: string; type: string }[];
};

export default function StartupCard({ startup }: { startup: StartupDTO }) {
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="relative flex w-72 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-card"
      >
        {startup.featured && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-gold-gradient px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950">
            Featured
          </span>
        )}

        <div className="relative h-28 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={startup.coverImage}
            alt=""
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-850 to-transparent" />
          <span className="absolute -bottom-5 left-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-ink-800 text-xl shadow-card">
            {startup.icon}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4 pt-8">
          <h3 className="font-display text-base font-semibold text-white">
            {startup.name}
          </h3>
          <p className="mt-1 line-clamp-2 flex-1 text-sm text-mist-400">
            {startup.tagline}
          </p>

          <span className="mt-3 inline-block w-fit rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-mist-300">
            {startup.category}
          </span>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-mist-400">
              <div className="flex -space-x-2">
                {startup.members.slice(0, 3).map((m) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={m._id}
                    src={m.avatarUrl}
                    alt={m.name}
                    className="h-6 w-6 rounded-full border-2 border-ink-850 object-cover"
                  />
                ))}
              </div>
              <span className="flex items-center gap-1">
                <Users size={12} /> {startup.members.length}
              </span>
            </div>

            {startup.openRoles.length > 0 ? (
              <button
                onClick={() => setApplyOpen(true)}
                className="flex items-center gap-1 rounded-full bg-gold-400/10 px-3 py-1.5 text-xs font-medium text-gold-300 transition-colors hover:bg-gold-400/20"
              >
                Apply <ArrowRight size={12} />
              </button>
            ) : (
              <button className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-mist-400 transition-colors hover:bg-white/10 hover:text-white">
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {applyOpen && (
        <ApplyModal startup={startup} onClose={() => setApplyOpen(false)} />
      )}
    </>
  );
}
