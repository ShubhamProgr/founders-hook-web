"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Rocket,
  Briefcase,
  Handshake,
  Sparkles,
  TrendingUp,
} from "lucide-react";

type Stats = { founders: number; startups: number; openRoles: number };

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Founders", href: "/feed" },
  { label: "Startups", href: "/feed" },
  { label: "Community", href: "/feed" },
  { label: "Resources", href: "/feed" },
];

const FEATURES = [
  {
    icon: Handshake,
    title: "Connect",
    desc: "Meet fellow student founders building in your field.",
  },
  {
    icon: Sparkles,
    title: "Collaborate",
    desc: "Form co-founding teams and ship your idea together.",
  },
  {
    icon: TrendingUp,
    title: "Grow",
    desc: "Get resources, mentorship and expert guidance.",
  },
  {
    icon: Briefcase,
    title: "Hire",
    desc: "Bring on student interns who want real experience.",
  },
];

function useAuthedUser() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setLoggedIn(Boolean(d.user)))
      .catch(() => setLoggedIn(false));
  }, []);
  return loggedIn;
}

export default function LandingPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const loggedIn = useAuthedUser();

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const primaryHref = loggedIn ? "/feed" : "/signup";
  const primaryLabel = loggedIn ? "Go to Feed" : "Join the Community";

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-radial">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[120px]" />

      {/* NAVBAR */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-gradient font-display text-lg font-bold text-ink-950">
            F
          </span>
          <span className="font-display text-lg font-semibold tracking-wide">
            FOUNDERS HOOK
          </span>
        </Link>

        <nav className="hidden items-center gap-9 text-sm text-mist-300 md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="transition-colors hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href={primaryHref} className="btn-outline !py-2.5 !px-5 text-xs md:text-sm">
          {primaryLabel}
          <ArrowRight size={15} />
        </Link>
      </header>

      {/* HERO */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-6 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-card">
          <div className="absolute inset-0">
            <Image
              src="https://picsum.photos/seed/foundershook-hero/1800/1100"
              alt="Founders collaborating in a coworking space"
              fill
              priority
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
          </div>

          <div className="relative px-6 pb-14 pt-14 sm:px-10 lg:px-14 lg:pb-20 lg:pt-20">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-xs font-semibold tracking-[0.25em] text-gold-300"
            >
              BUILD. CONNECT. GROW.
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
            >
              The Exclusive Network for{" "}
              <span className="bg-gold-gradient bg-clip-text text-transparent">
                Startup Founders
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-mist-300"
            >
              Founders Hook is where college founders publish their ideas,
              build teams, and connect with students looking for real
              startup internships. Built for founders, by founders.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <Link href={primaryHref} className="btn-gold">
                {primaryLabel}
                <ArrowRight size={16} />
              </Link>
              <Link href="/feed" className="btn-outline">
                Explore Founders
              </Link>
            </motion.div>

            <span className="pointer-events-none absolute right-10 top-1/2 hidden -translate-y-1/2 text-right font-display text-3xl font-medium uppercase leading-tight text-white/10 xl:block">
              Building
              <br />
              the Future
              <br />
              Together
            </span>
          </div>

          {/* STATS BAR — pulled live from MongoDB via /api/stats */}
          <div className="relative mx-6 mb-8 grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-black/40 px-8 py-7 backdrop-blur sm:grid-cols-3 sm:mx-10 lg:mx-14">
            <StatItem icon={Users} value={stats?.founders} label="Active Founders" />
            <StatItem icon={Rocket} value={stats?.startups} label="Startups" divider />
            <StatItem icon={Briefcase} value={stats?.openRoles} label="Open Internships" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-ink-900 p-7 transition-colors hover:bg-ink-850"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-gold-400/25 bg-gold-400/10 text-gold-300 transition-transform duration-200 group-hover:scale-110">
                <f.icon size={20} />
              </div>
              <h3 className="mb-1.5 font-display text-lg font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-mist-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-mist-500">
        © {new Date().getFullYear()} Founders Hook. Built for founders, by founders.
      </footer>
    </main>
  );
}

function StatItem({
  icon: Icon,
  value,
  label,
  divider,
}: {
  icon: React.ElementType;
  value?: number;
  label: string;
  divider?: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 ${divider ? "sm:border-x sm:border-white/10 sm:px-6" : ""}`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-300">
        <Icon size={20} />
      </div>
      <div>
        <p className="font-display text-2xl font-semibold text-white">
          {value === undefined ? (
            <span className="inline-block h-6 w-14 animate-pulse rounded bg-white/10 align-middle" />
          ) : (
            `${value.toLocaleString()}+`
          )}
        </p>
        <p className="text-sm text-mist-400">{label}</p>
      </div>
    </div>
  );
}
