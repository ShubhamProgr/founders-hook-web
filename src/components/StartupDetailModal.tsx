"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  Briefcase,
  Clock,
  ArrowRight,
  Loader2,
  Star,
  Pencil,
} from "lucide-react";
import type { StartupDTO } from "./StartupCard";
import ApplyModal from "./ApplyModal";
import ProjectSetupModal, { type ProjectSetupInitialData } from "./ProjectSetupModal";

type FullStartup = StartupDTO & {
  description: string;
  founder?: { _id: string; name: string; username: string; avatarUrl: string };
};

const roleTypeColors: Record<string, string> = {
  Internship:
    "bg-violet-400/10 text-violet-300 border border-violet-400/20",
  "Full-time":
    "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20",
  "Part-time": "bg-amber-400/10 text-amber-300 border border-amber-400/20",
};

export default function StartupDetailModal({
  startupId,
  onClose,
}: {
  startupId: string;
  onClose: () => void;
}) {
  const [startup, setStartup] = useState<FullStartup | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [meId, setMeId] = useState<string | null>(null);

  // Fetch current user id
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setMeId(d.user?.id ?? null))
      .catch(() => {});
  }, []);

  function loadStartup() {
    setLoading(true);
    fetch(`/api/startups/${startupId}`)
      .then((r) => r.json())
      .then((d) => {
        setStartup(d.startup);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    loadStartup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startupId]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleApply(roleId?: string) {
    if (roleId) setSelectedRole(roleId);
    setApplyOpen(true);
  }

  // When ApplyModal opens, pass a startup with pre-selected role first
  const startupForApply = startup
    ? {
        ...startup,
        openRoles: selectedRole
          ? [
              ...startup.openRoles.filter((r) => r._id === selectedRole),
              ...startup.openRoles.filter((r) => r._id !== selectedRole),
            ]
          : startup.openRoles,
      }
    : null;

  const isFounder =
    meId && startup?.founder ? startup.founder._id === meId : false;

  // Build initialData for edit modal
  const editInitialData: ProjectSetupInitialData | undefined = startup
    ? {
        projectName: startup.name,
        tagline: startup.tagline,
        projectDescription: startup.description ?? "",
        category: startup.category,
        logoUrl: startup.icon?.startsWith("http") ? startup.icon : "",
        bannerUrl: startup.coverImage ?? "",
        openRoles: startup.openRoles.map((r) => ({
          title: r.title,
          type: r.type as "Internship" | "Full-time" | "Part-time",
          description: r.description ?? "",
          paid: false,
        })),
      }
    : undefined;

  return (
    <AnimatePresence>
      <motion.div
        key="startup-detail-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/75 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-ink-900 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-mist-400 backdrop-blur-sm transition hover:text-white"
          >
            <X size={16} />
          </button>

          {/* Edit button – only visible to the founder */}
          {isFounder && !loading && (
            <button
              onClick={() => setEditOpen(true)}
              className="absolute right-14 top-4 z-10 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-mist-300 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"
            >
              <Pencil size={12} /> Edit
            </button>
          )}

          {loading ? (
            <div className="flex h-72 items-center justify-center">
              <Loader2 size={28} className="animate-spin text-gold-300" />
            </div>
          ) : !startup ? (
            <div className="flex h-72 items-center justify-center text-mist-400">
              Failed to load startup details.
            </div>
          ) : (
            <>
              {/* ── Banner ── */}
              <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={startup.coverImage}
                  alt={startup.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />

                {startup.featured && (
                  <span className="absolute left-4 top-4 rounded-full bg-gold-gradient px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950">
                    <Star size={10} className="mr-1 inline" />
                    Featured
                  </span>
                )}
              </div>

              {/* ── Logo + name ── */}
              <div className="relative px-6 pb-0 pt-0">
                {/* Icon sits on the banner edge */}
                <div className="-mt-7 mb-3 flex items-end gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink-800 bg-ink-850 text-3xl shadow-card overflow-hidden">
                    {startup.icon?.startsWith("http") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={startup.icon} alt={startup.name} className="h-full w-full object-cover" />
                    ) : (
                      startup.icon || "🚀"
                    )}
                  </span>
                  <div className="pb-1">
                    <h2 className="font-display text-xl font-semibold leading-tight text-white">
                      {startup.name}
                    </h2>
                    <span className="mt-0.5 inline-block rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-mist-300">
                      {startup.category}
                    </span>
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-sm font-medium text-mist-300">
                  {startup.tagline}
                </p>

                {/* Description */}
                {startup.description && (
                  <p className="mt-3 text-sm leading-relaxed text-mist-400">
                    {startup.description}
                  </p>
                )}

                {/* ── Team ── */}
                {startup.members.length > 0 && (
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {startup.members.slice(0, 5).map((m, idx) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={m._id || `member-${idx}`}
                          src={m.avatarUrl}
                          alt={m.name}
                          title={m.name}
                          className="h-8 w-8 rounded-full border-2 border-ink-900 object-cover"
                        />
                      ))}
                    </div>
                    <span className="flex items-center gap-1.5 text-xs text-mist-400">
                      <Users size={13} />
                      {startup.members.length}{" "}
                      {startup.members.length === 1 ? "member" : "members"}
                    </span>
                  </div>
                )}

                {/* ── Open Roles ── */}
                <div className="mt-6 mb-6">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <Briefcase size={14} className="text-gold-300" />
                    Open Roles
                    {startup.openRoles.length > 0 && (
                      <span className="rounded-full bg-gold-400/10 px-2 py-0.5 text-[10px] font-medium text-gold-300">
                        {startup.openRoles.length}
                      </span>
                    )}
                  </h3>

                  {startup.openRoles.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-center text-sm text-mist-500">
                      No open roles at the moment.
                    </p>
                  ) : (
                    <ul className="space-y-2.5">
                      {startup.openRoles.map((role, idx) => (
                        <motion.li
                          key={role._id || `role-${idx}`}
                          whileHover={{ x: 2 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 transition hover:border-white/15 hover:bg-white/[0.06]"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-white">
                              {role.title}
                            </span>
                            {role.description && (
                              <span className="line-clamp-1 text-xs text-mist-500">
                                {role.description}
                              </span>
                            )}
                            <span
                              className={`mt-0.5 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                roleTypeColors[role.type] ??
                                "bg-white/5 text-mist-400"
                              }`}
                            >
                              <Clock size={9} />
                              {role.type}
                            </span>
                          </div>
                          <button
                            onClick={() => handleApply(role._id)}
                            className="ml-4 flex shrink-0 items-center gap-1 rounded-full bg-gold-400/10 px-3 py-1.5 text-xs font-medium text-gold-300 transition hover:bg-gold-400/20"
                          >
                            Apply <ArrowRight size={11} />
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      {applyOpen && startupForApply && (
        <ApplyModal
          key="apply-modal"
          startup={startupForApply}
          onClose={() => {
            setApplyOpen(false);
            setSelectedRole(null);
          }}
        />
      )}

      {editOpen && startup && editInitialData && (
        <ProjectSetupModal
          key="edit-modal"
          startupId={startup._id}
          initialData={editInitialData}
          onClose={() => {
            setEditOpen(false);
            // Reload the startup details after edit
            loadStartup();
          }}
        />
      )}
    </AnimatePresence>
  );
}
