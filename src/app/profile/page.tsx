"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, FileText, Pencil, Sparkles, UserRound, Upload, Save, Loader2, Bot, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { CldUploadWidget } from "next-cloudinary";

// 1. ADD YOUR CUSTOM TEXT HERE
const QUESTION_LABELS: Record<string, string> = {
  "6a65a437a2b367178cacb7ea": "Current Role",
  "6a6cb2450a2a7c50815cf930": "Years of Experience",
  "6a6cb2d70a2a7c50815cf932": "Main Objective",
};

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
  const [isEditingBio, setIsEditingBio] = useState(false);

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

// 1. Update your save function to pass the user ID
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile/bio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user._id || user.id, // Pass ID to backend
          bio, 
          profilePic 
        }),
      });

      if (!res.ok) {
        alert("Failed to update profile.");
      } else {
        setIsEditingBio(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

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
        <section className="relative z-10 mx-auto max-w-6xl px-6 pb-28 pt-16 lg:px-10">
          
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              
              <div className="flex flex-col items-center gap-3 sm:items-start">
                {/* 2. Update your Cloudinary Widget to auto-save immediately */}
  <CldUploadWidget 
    uploadPreset="founders_hook_users" 
    onSuccess={async (result) => {
      if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
        const newPicUrl = result.info.secure_url;
        setProfilePic(newPicUrl); // Update UI instantly

        // AUTO-SAVE to MongoDB so it doesn't disappear on refresh
        try {
          await fetch("/api/profile/bio", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              userId: user._id || user.id,
              bio: bio, 
              profilePic: newPicUrl 
            }),
          });
        } catch (error) {
          console.error("Failed to auto-save image to database", error);
        }
      }
    }}
  >
                  {({ open }) => (
                    <div 
                      onClick={() => open()}
                      className="group relative h-32 w-32 cursor-pointer overflow-hidden rounded-2xl border border-white/15 shadow-card"
                    >
                      <Image
                        src={profilePic || "https://picsum.photos/seed/user/160/160"}
                        alt={user.name}
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 hidden flex-col items-center justify-center bg-black/60 transition-all group-hover:flex">
                        <Upload size={20} className="mb-1 text-white" />
                        <span className="text-xs font-medium text-white">Edit</span>
                      </div>
                    </div>
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
              Edit profile
            </Link>
          </div>

          {/* 2. GRID UPDATED HERE: lg:grid-cols-[minmax(0,1.5fr)_1fr] makes the right box smaller */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_1fr] gap-6 border-b border-white/10 pb-8">
            
            <section className="rounded-2xl border border-white/10 bg-ink-900/75 p-6 shadow-card backdrop-blur h-full flex flex-col">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-300">
                  <Sparkles size={19} />
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold text-white">Bio</h2>
                  <p className="text-sm text-mist-500">Tell the community about yourself</p>
                </div>
              </div>

              {isEditingBio ? (
                <div className="flex-1 flex flex-col gap-4">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="What are you building? What's your background?"
                    rows={6}
                    className="w-full flex-1 resize-y rounded-xl border border-white/10 bg-ink-950 p-4 text-base leading-relaxed text-mist-100 placeholder:text-mist-600 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all"
                  />
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() => setIsEditingBio(false)}
                      disabled={isSaving}
                      className="inline-flex w-fit items-center gap-2 px-4 py-2 text-sm text-mist-300 hover:text-white transition-colors"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="btn-gold inline-flex w-fit items-center gap-2 px-4 py-2 text-sm disabled:opacity-70"
                    >
                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      {isSaving ? "Saving..." : "Save Bio"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <p className="flex-1 text-base leading-relaxed text-mist-200 whitespace-pre-wrap">
                    {bio || "You haven't written a bio yet. Tell the community what you are building!"}
                  </p>
                  
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setIsEditingBio(true)}
                      className="btn-outline inline-flex items-center gap-2 px-4 py-2 text-sm"
                    >
                      <Pencil size={16} />
                      Edit Bio
                    </button>
                    
                    <button
                      disabled
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-white/5 bg-white/5 text-mist-400 cursor-not-allowed"
                      title="Coming Soon"
                    >
                      <Bot size={16} />
                      Write with AI (Coming Soon)
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-white/10 bg-ink-900/75 p-6 shadow-card backdrop-blur h-full">
              <div className="mb-5 flex items-center gap-3">
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
                      {/* 3. MAPPING APPLIED HERE: Checks the dictionary above for a custom label */}
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-mist-500">
                        {QUESTION_LABELS[question] || question}
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
            
          </div>

        </section>
      </main>
    </div>
  );
}