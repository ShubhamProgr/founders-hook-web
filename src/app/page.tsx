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
  MessageSquare,
  Globe,
  BookOpen,
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
    <main className="relative min-h-screen w-full overflow-x-hidden bg-ink-radial">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[120px]" />

      {/* NAVBAR */}
      <header className="relative z-20 flex w-full items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="https://res.cloudinary.com/t7efuhnd/image/upload/v1786022235/founder_hook_iorswv.jpg" alt="Founders Hook Logo" width={36} height={36} className="rounded-lg object-cover" />
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
      <section className="relative z-10 w-full pb-16 pt-6">
        <div className="relative overflow-hidden border-y border-white/10 shadow-card lg:border-x">
          <div className="absolute inset-0">
            <Image
              src="https://res.cloudinary.com/t7efuhnd/image/upload/v1785570893/tyler-franta-iusJ25iYu1c-unsplash_ysk7pp.jpg"
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
          <div className="relative mb-8 grid grid-cols-1 gap-6 border-y border-white/10 bg-black/40 px-8 py-7 backdrop-blur sm:grid-cols-3 lg:px-14">
            <StatItem icon={Users} value={stats?.founders} label="Active Founders" />
            <StatItem icon={Rocket} value={stats?.startups} label="Startups" divider />
            <StatItem icon={Briefcase} value={stats?.openRoles} label="Open Internships" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 w-full pb-24">
        <div className="grid grid-cols-1 gap-px border-y border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* NETWORKING SECTION */}
      <section className="relative z-10 w-full border-y border-white/10 bg-ink-950 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-400/10 text-gold-300">
                <Globe size={28} />
              </div>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl text-white">
                The Network for the Next Generation
              </h2>
              <p className="mt-6 text-base leading-relaxed text-mist-400">
                Connect with passionate student founders from campuses around the world. 
                Whether you're looking for a technical co-founder to build your MVP or 
                a marketing wiz to launch your product, our networking tools make it 
                effortless to find the right people for your startup journey.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Discover founders by campus, major, or skill set.",
                  "Filter startups by industry and funding stage.",
                  "Join localized communities and special interest groups.",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-mist-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square max-h-[500px] w-full overflow-hidden rounded-2xl border border-white/10 lg:h-[500px]"
            >
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt="Students networking"
                fill
                className="object-cover grayscale transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink-950/20 mix-blend-multiply" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOUNDERS INTERACTION SECTION */}
      <section className="relative z-10 w-full bg-ink-900 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="order-2 relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 lg:order-1 lg:h-[500px]"
            >
              <Image
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
                alt="Founders discussing ideas"
                fill
                className="object-cover grayscale transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-ink-950/80 to-transparent" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-400/10 text-gold-300">
                <MessageSquare size={28} />
              </div>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl text-white">
                Meaningful Interactions
              </h2>
              <p className="mt-6 text-base leading-relaxed text-mist-400">
                Stop shouting into the void. Founders Hook provides dedicated spaces 
                to discuss ideas, ask for feedback, and form partnerships. It's a 
                community that actually cares about what you're building.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-white/5 p-5">
                  <h4 className="font-display font-medium text-white">Direct Messaging</h4>
                  <p className="mt-2 text-sm text-mist-500">Reach out directly to potential co-founders and team members securely.</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-5">
                  <h4 className="font-display font-medium text-white">Project Feeds</h4>
                  <p className="mt-2 text-sm text-mist-500">Share your progress, post updates, and get constructive feedback from peers.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* KNOWLEDGE HUB SECTION */}
      <section className="relative z-10 w-full border-t border-white/10 bg-ink-950 py-24 pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-400/10 text-gold-300">
                <BookOpen size={32} />
              </div>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl text-white">
                The Founders Knowledge Hub
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-mist-400">
                Building a startup is hard. We provide the resources you need to 
                navigate the journey from idea to execution. Access guides, templates, 
                and case studies tailored for student entrepreneurs.
              </p>
            </motion.div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Startup Playbooks",
                desc: "Step-by-step guides from ideation to seed round.",
                img: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Pitch Templates",
                desc: "Winning pitch deck structures used by successful founders.",
                img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Legal & Equity",
                desc: "Understand term sheets, vesting, and founder agreements.",
                img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
              }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-ink-900 transition-colors hover:border-white/20"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover grayscale transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-ink-950/40 mix-blend-multiply" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-mist-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 flex justify-center"
          >
            <Link href={primaryHref} className="btn-gold !px-8 !py-3">
              Explore Resources
              <ArrowRight size={18} />
            </Link>
          </motion.div>
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
