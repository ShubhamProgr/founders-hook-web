"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

type Question = {
  _id: string;
  key: string;
  title: string;
  subtitle?: string;
  type: "single-choice" | "multi-choice" | "text";
  options?: string[];
  isRequired: boolean;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/onboarding/questions");
        if (!res.ok) throw new Error("Failed to load questions");
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        setError("Failed to load onboarding questions. Please refresh.");
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink-radial">
        <p className="text-mist-400">Loading your onboarding experience...</p>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink-radial">
        <p className="text-mist-400">No questions found. Please add them to your database.</p>
      </main>
    );
  }

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  function canAdvance() {
    if (!currentQuestion.isRequired) return true;
    
    const currentAnswer = answers[currentQuestion.key];
    if (currentQuestion.type === "multi-choice") {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    return !!currentAnswer && String(currentAnswer).trim() !== "";
  }

  function handleToggle(value: string) {
    if (currentQuestion.type === "single-choice") {
      setAnswers((a) => ({ ...a, [currentQuestion.key]: value }));
    } else if (currentQuestion.type === "multi-choice") {
      setAnswers((a) => {
        const currentSelected = (a[currentQuestion.key] as string[]) || [];
        const isSelected = currentSelected.includes(value);
        return {
          ...a,
          [currentQuestion.key]: isSelected
            ? currentSelected.filter((v) => v !== value)
            : [...currentSelected, value],
        };
      });
    }
  }

  function handleTextChange(value: string) {
    setAnswers((a) => ({ ...a, [currentQuestion.key]: value }));
  }

  async function handleFinish() {
    setError("");
    setSubmitting(true);
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
      setSubmitting(false);
    }
  }

  function next() {
    if (step === questions.length - 1) {
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
              Step {step + 1} of {questions.length}
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
              key={currentQuestion.key}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionBlock
                title={currentQuestion.title}
                subtitle={currentQuestion.subtitle}
              >
                {(currentQuestion.type === "single-choice" || currentQuestion.type === "multi-choice") && (
                  <OptionGrid
                    options={currentQuestion.options || []}
                    selected={
                      currentQuestion.type === "multi-choice"
                        ? answers[currentQuestion.key] || []
                        : answers[currentQuestion.key]
                        ? [answers[currentQuestion.key]]
                        : []
                    }
                    multi={currentQuestion.type === "multi-choice"}
                    onToggle={handleToggle}
                  />
                )}

                {currentQuestion.type === "text" && (
                  <textarea
                    value={answers[currentQuestion.key] || ""}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={4}
                    className="field-input w-full resize-none"
                  />
                )}
              </QuestionBlock>
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
              disabled={!canAdvance() || submitting}
              className="btn-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step === questions.length - 1 ? (submitting ? "Saving…" : "Finish") : "Continue"}
              {step === questions.length - 1 ? <Check size={16} /> : <ArrowRight size={16} />}
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