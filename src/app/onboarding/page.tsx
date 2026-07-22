"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  key: "role" | "field" | "experience" | "skills" | "lookingFor" | "availability";
  eyebrow: string;
  title: string;
  subtitle: string;
  multi?: boolean;
  options: string[];
};

const questions: Question[] = [
  {
    key: "role",
    eyebrow: "01 / professional life",
    title: "What best describes you right now?",
    subtitle: "This shapes what your feed and matches look like.",
    options: ["Startup founder", "Student looking for internships", "Both"],
  },
  {
    key: "field",
    eyebrow: "02 / field of technology",
    title: "What's your primary field?",
    subtitle: "Pick the one you spend the most time in.",
    options: [
      "Web Development",
      "Mobile Development",
      "AI / Machine Learning",
      "Data Science",
      "Blockchain / Web3",
      "Cybersecurity",
      "UI/UX Design",
      "Product Management",
      "DevOps / Cloud",
      "Hardware / IoT",
    ],
  },
  {
    key: "experience",
    eyebrow: "03 / experience level",
    title: "How much hands-on experience do you have?",
    subtitle: "Be honest — this helps founders set the right expectations.",
    options: [
      "Just starting out",
      "Beginner (0–1 yr)",
      "Intermediate (1–3 yrs)",
      "Advanced (3+ yrs)",
    ],
  },
  {
    key: "skills",
    eyebrow: "04 / expertise",
    title: "Which skills do you bring to the table?",
    subtitle: "Select as many as apply.",
    multi: true,
    options: [
      "React / Next.js",
      "Node.js",
      "Python",
      "Java / Kotlin",
      "Swift",
      "Figma / Design",
      "Solidity",
      "TensorFlow / PyTorch",
      "AWS / GCP",
      "SQL / NoSQL",
      "Marketing / Growth",
      "Business / Finance",
    ],
  },
  {
    key: "lookingFor",
    eyebrow: "05 / goals",
    title: "What are you hoping to find on Forge?",
    subtitle: "Select as many as apply.",
    multi: true,
    options: [
      "Internship opportunities",
      "Co-founders",
      "Team members to hire",
      "Mentorship",
      "Networking",
      "Just exploring",
    ],
  },
  {
    key: "availability",
    eyebrow: "06 / availability",
    title: "How much time can you commit?",
    subtitle: "Last one — then you're in.",
    options: ["Full-time", "Part-time", "Weekends only", "Flexible / project-based"],
  },
];

type Answers = {
  role: string;
  field: string;
  experience: string;
  skills: string[];
  lookingFor: string[];
  availability: string;
};

const emptyAnswers: Answers = {
  role: "",
  field: "",
  experience: "",
  skills: [],
  lookingFor: [],
  availability: "",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const q = questions[step];
  const isLast = step === questions.length - 1;
  const currentValue = answers[q.key];
  const hasAnswer = q.multi
    ? (currentValue as string[]).length > 0
    : (currentValue as string).length > 0;

  function toggleOption(option: string) {
    setAnswers((prev) => {
      if (q.multi) {
        const list = prev[q.key] as string[];
        const next = list.includes(option)
          ? list.filter((o) => o !== option)
          : [...list, option];
        return { ...prev, [q.key]: next };
      }
      return { ...prev, [q.key]: option };
    });
  }

  async function handleNext() {
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Couldn't save your answers. Try again.");
        setSubmitting(false);
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Couldn't reach the server. Try again.");
      setSubmitting(false);
    }
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <main className="min-h-screen bg-bg noise-bg flex flex-col">
      {/* progress bar */}
      <div className="h-1 bg-panel w-full">
        <div
          className="h-1 bg-lime transition-all duration-500 ease-out"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div key={step} className="w-full max-w-2xl animate-fade-up">
          <div className="font-mono text-xs text-lime tracking-wide mb-3">
            {q.eyebrow}
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl mb-2">
            {q.title}
          </h1>
          <p className="text-muted mb-8">{q.subtitle}</p>

          <div className="grid sm:grid-cols-2 gap-3">
            {q.options.map((option) => {
              const selected = q.multi
                ? (currentValue as string[]).includes(option)
                : currentValue === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleOption(option)}
                  className={`text-left px-5 py-4 rounded-xl border transition-all font-display font-medium ${
                    selected
                      ? "border-lime bg-lime/10 text-ink shadow-limeglow"
                      : "border-line bg-panel text-muted hover:border-purple/50 hover:text-ink"
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    {option}
                    <span
                      className={`w-4 h-4 rounded-full border flex-shrink-0 ${
                        selected ? "bg-lime border-lime" : "border-muted/40"
                      }`}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          {error && (
            <p className="text-sm text-red-400 font-mono bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 mt-6">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between mt-10">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0}
              className="font-mono text-sm text-muted hover:text-ink transition-colors disabled:opacity-0"
            >
              ← Back
            </button>
            <span className="font-mono text-xs text-muted">
              {step + 1} / {questions.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={!hasAnswer || submitting}
              className="bg-purple hover:bg-purple-glow disabled:opacity-40 disabled:hover:bg-purple text-white font-display font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-glow"
            >
              {submitting ? "Saving…" : isLast ? "Finish" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
