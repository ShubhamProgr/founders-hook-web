"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, FileText, Pencil, Sparkles, UserRound, Upload, Save, Loader2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { CldUploadWidget } from "next-cloudinary";

function normalizeAnswers(value: unknown): Record<string, unknown> {
  if (!value) return {};

  if (value instanceof Map) {
    return Object.fromEntries(value.entries());
  }

  if (typeof value === "object") {
    return JSON.parse(JSON.stringify(value));
  }

  return {};
}

function formatAnswer(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined || value === "") return "Not answered";
  return String(value);
}

export default function ProfilePage() {
  const router = useRouter();
  
  // State for user data and form
  const [user, setUser] = useState<any>(null);
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
          setBio(data.user.bio || "");
          setProfilePic(data.user.profilePic || data.user.avatarUrl || "");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile/bio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, profilePic }),
      });

      if (!res.ok) {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-ink-950 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
      </div>
    );
  }

  if (!user) return null;

  const answers = normalizeAnswers(user.onboardingAnswers);
  const answerEntries = Object.entries(answers).filter(([, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && String(value).trim() !== "";
  });
  
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en", { month: "long", year: "numeric" })
    : "Recently";

  const sidebarUser = {
    name: user.name,
    username: user.username,
    avatarUrl: profilePic || user.avatarUrl,
  };

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar user={sidebarUser} />

      <main className="relative min-w-0 flex-1 overflow-hidden">
        {/* Banner has been completely removed as requested */}
        
        <section className="relative z-10 mx-auto max-w-6xl px-6 pb-28 pt-16 lg:px-10">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              
              {/* Avatar & Upload Button Group */}
              <div className="flex flex-col items-center gap-3 sm:items-start">
                <Image
                  src={profilePic || "https://picsum.photos/seed/user/160/160"}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="h-32 w-32 rounded-2xl border border-white/15 object-cover shadow-card"
                />
                
                <CldUploadWidget 
                  uploadPreset="founders_hook_users" 
                  onSuccess={(result) => {
                    if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                      setProfilePic(result.info.secure_url);
                    }
                  }}
                >
                  {({ open }) => (
                    <button 
                      type="button" 
                      onClick={() => open()}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      <Upload size={14} />
                      Change Picture
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/10 px-3 py-1 text-xs font-semibold text-gold-200">
                  <UserRound size={14} />
                  Founder profile
                </p>
                <h1 className="font-display text-4xl font-semibold text-white">{user.name}</h1>
                <p className="mt-1 text-sm text-mist-400">@{user.username}</p>
                <p className="mt-3 flex items-center gap-2 text-sm text-mist-400">
                  <CalendarDays size={15} />
                  Joined {joinedDate}
                </p>
              </div>
            </div>

            <Link href="/onboarding" className="btn-outline w-fit">
              <Pencil size={16} />
              Rebuild Profile
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* Editable Bio Section */}
            <section className="rounded-2xl border border-white/10 bg-ink-900/75 p-6 shadow-card backdrop-blur">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-300">
                    <Sparkles size={19} />
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-white">Bio</h2>
                    <p className="text-sm text-mist-500">Tell the community about yourself</p>
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="btn-gold inline-flex w-fit items-center gap-2 px-4 py-2 text-sm disabled:opacity-70"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSaving ? "Saving..." : "Save Bio"}
                </button>
              </div>

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What are you building? What's your background?"
                rows={6}
                className="w-full resize-y rounded-xl border border-white/10 bg-ink-950 p-4 text-base leading-relaxed text-mist-100 placeholder:text-mist-600 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all"
              />
            </section>

            {/* Answers Aside - Left untouched to match theme */}
            <aside className="space-y-6">
              <section className="rounded-2xl border border-white/10 bg-ink-900/75 p-6 shadow-card backdrop-blur">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-mist-300">
                    <FileText size={18} />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-white">Profile Details</h2>
                    <p className="text-sm text-mist-500">From onboarding</p>
                  </div>
                </div>

                {answerEntries.length > 0 ? (
                  <dl className="space-y-4">
                    {answerEntries.slice(0, 6).map(([question, answer]) => (
                      <div key={question}>
                        <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-mist-500">
                          {question}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-mist-200">
                          {formatAnswer(answer)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-sm leading-6 text-mist-400">
                    Finish onboarding to fill out this profile framework.
                  </p>
                )}
              </section>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}