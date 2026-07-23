"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import {
  PROFESSIONAL_STATUSES,
  TECH_FIELDS,
  EXPERTISE_LEVELS,
  LOOKING_FOR_OPTIONS,
} from "@/models/User";

type Answers = {
  professionalStatus: string;
  techFields: string[];
  expertiseLevel: string;
  lookingFor: string;
  college: string;
  bio: string;
};

const STEPS = [
  "professionalStatus",
  "techFields",
  "expertiseLevel",
  "lookingFor",
  "profile",
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Answers>({
    professionalStatus: "",
    techFields: [],
    expertiseLevel: "",
    lookingFor: "",
    college: "",
    bio: "",
  });

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  function canAdvance() {
    if (current === "professionalStatus") return !!answers.professionalStatus;
    if (current === "techFields") return answers.techFields.length > 0;
    if (current === "expertiseLevel") return !!answers.expertiseLevel;
    if (current === "lookingFor") return !!answers.lookingFor;
    return true;
  }

  function toggleTechField(field: string) {
    setAnswers((a) => ({
      ...a,
      techFields: a.techFields.includes(field)
        ? a.techFields.filter((f) => f !== field)
        : [...a.techFields, field],
    }));
  }

  async function handleFinish() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      router.push("/feed");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function next() {
    if (step === STEPS.length - 1) {
      handleFinish();
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-ink-radial px-6 py-16">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[110px]" />

      <div className="relative z-10 w-full max-w-xl">
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs text-mist-500">
            <span>
              Step {step + 1} of {STEPS.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gold-gradient"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-ink-900/80 p-8 shadow-card backdrop-blur-xl sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              {current === "professionalStatus" && (
                <QuestionBlock
                  title="What best describes you right now?"
                  subtitle="This helps us tailor your feed."
                >
                  <OptionGrid
                    options={[...PROFESSIONAL_STATUSES]}
                    selected={[answers.professionalStatus]}
                    onToggle={(v) =>
                      setAnswers((a) => ({ ...a, professionalStatus: v }))
                    }
                  />
                </QuestionBlock>
              )}

              {current === "techFields" && (
                <QuestionBlock
                  title="Which fields of technology interest you?"
                  subtitle="Pick as many as apply."
                >
                  <OptionGrid
                    options={[...TECH_FIELDS]}
                    selected={answers.techFields}
                    multi
                    onToggle={toggleTechField}
                  />
                </QuestionBlock>
              )}

              {current === "expertiseLevel" && (
                <QuestionBlock
                  title="How would you rate your expertise?"
                  subtitle="Be honest — there's no wrong answer."
                >
                  <OptionGrid
                    options={[...EXPERTISE_LEVELS]}
                    selected={[answers.expertiseLevel]}
                    onToggle={(v) => setAnswers((a) => ({ ...a, expertiseLevel: v }))}
                  />
                </QuestionBlock>
              )}

              {current === "lookingFor" && (
                <QuestionBlock
                  title="What brings you to Founders Hook?"
                  subtitle="We'll surface the right people and startups."
                >
                  <OptionGrid
                    options={[...LOOKING_FOR_OPTIONS]}
                    selected={[answers.lookingFor]}
                    onToggle={(v) => setAnswers((a) => ({ ...a, lookingFor: v }))}
                  />
                </QuestionBlock>
              )}

              {current === "profile" && (
                <QuestionBlock
                  title="Almost done — a little about you"
                  subtitle="Optional, but it helps others recognize you."
                >
                  <div className="space-y-4">
                    <input
                      value={answers.college}
                      onChange={(e) =>
                        setAnswers((a) => ({ ...a, college: e.target.value }))
                      }
                      placeholder="College / University (optional)"
                      className="field-input"
                    />
                    <textarea
                      value={answers.bio}
                      onChange={(e) =>
                        setAnswers((a) => ({ ...a, bio: e.target.value }))
                      }
                      placeholder="A one-line bio (optional)"
                      rows={3}
                      maxLength={280}
                      className="field-input resize-none"
                    />
                  </div>
                </QuestionBlock>
              )}
            </motion.div>
          </AnimatePresence>

          {error && (
            <p className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="mt-9 flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 text-sm text-mist-400 transition-colors hover:text-white disabled:opacity-0"
            >
              <ArrowLeft size={15} /> Back
            </button>

            <button
              onClick={next}
              disabled={!canAdvance() || loading}
              className="btn-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step === STEPS.length - 1 ? (loading ? "Saving…" : "Finish") : "Continue"}
              {step === STEPS.length - 1 ? <Check size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function QuestionBlock({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
      {subtitle && <p className="mt-1.5 text-sm text-mist-400">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function OptionGrid({
  options,
  selected,
  onToggle,
  multi = false,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  multi?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {options.map((opt) => {
        const isActive = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`chip justify-start text-left ${isActive ? "chip-active" : ""}`}
          >
            <span className="flex w-full items-center justify-between">
              {opt}
              {isActive && <Check size={15} className="text-gold-300" />}
            </span>
          </button>
        );
      })}
      {multi && (
        <p className="col-span-full mt-1 text-xs text-mist-500">
          {selected.length} selected
        </p>
      )}
    </div>
  );
}
