import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ForgeAnimation from "@/components/ForgeAnimation";
import Reveal from "@/components/Reveal";
import CursorGlow from "@/components/CursorGlow";

const stats = [
  { value: "1,240+", label: "startups posted" },
  { value: "8,900+", label: "students matched" },
  { value: "310", label: "campuses" },
];

const steps = [
  {
    tag: "founders",
    title: "Publish your idea",
    body: "Post the startup and the roles you need filled.",
  },
  {
    tag: "students",
    title: "Find real work",
    body: "Filter by field and skill to find a fit.",
  },
  {
    tag: "both",
    title: "Match & build",
    body: "Message directly and start shipping together.",
  },
];

const startups = [
  {
    name: "Cortex Notes",
    tagline: "AI lecture-notes that study for you",
    field: "AI / ML",
    roles: 3,
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Loopr",
    tagline: "Campus marketplace for secondhand tech",
    field: "Web Dev",
    roles: 5,
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Verdant Labs",
    tagline: "IoT soil sensors for smallholder farms",
    field: "Hardware / IoT",
    roles: 2,
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      {/* HERO */}
      <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-16 items-center overflow-hidden">
        <CursorGlow />

        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-muted border border-line rounded-full px-3 py-1 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-lime" />
            live across 310 campuses
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl leading-[1.08] tracking-tight">
            Find people
            <br />
            who'll <span className="text-gradient">actually build it.</span>
          </h1>

          <p className="mt-6 text-muted text-lg max-w-sm">
            Founders post real startups. Students find real work.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/login?mode=signup&role=founder"
              className="bg-purple hover:bg-purple-glow transition-colors text-white font-display font-semibold px-6 py-3 rounded-lg shadow-glow"
            >
              Post a startup
            </Link>
            <Link
              href="/login?mode=signup&role=student"
              className="border border-line text-ink hover:border-lime/60 hover:text-lime transition-colors font-display font-semibold px-6 py-3 rounded-lg"
            >
              Find internships
            </Link>
          </div>

          <div className="mt-12 flex gap-8 font-mono text-xs text-muted">
            {stats.map((s) => (
              <div key={s.label}>
                <span className="text-ink font-medium">{s.value}</span>{" "}
                {s.label}
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up [animation-delay:150ms]">
          <ForgeAnimation />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <Reveal>
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-12">
              How it works
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-px bg-line rounded-xl overflow-hidden">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <div className="bg-bg p-8 h-full">
                  <div className="font-mono text-[11px] text-lime uppercase tracking-wide mb-4">
                    {step.tag}
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED STARTUPS */}
      <section className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <Reveal>
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-10">
              Fresh listings
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {startups.map((s, i) => (
              <Reveal key={s.name} delay={i * 100}>
                <div className="group rounded-xl overflow-hidden card-border bg-panel transition-all hover:-translate-y-1 hover:shadow-glow h-full">
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={s.img}
                      alt={`${s.name} team at work`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="p-5">
                    <span className="font-mono text-[11px] text-purple-glow">
                      {s.field}
                    </span>
                    <h3 className="font-display font-semibold text-lg mt-1">
                      {s.name}
                    </h3>
                    <p className="text-muted text-sm mt-1">{s.tagline}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-mono text-lime">
                        {s.roles} roles open
                      </span>
                      <Link
                        href="/login"
                        className="text-xs font-mono text-ink border-b border-transparent group-hover:border-lime transition-colors"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-line">
        <Reveal>
          <div className="max-w-6xl mx-auto px-6 py-20 text-center">
            <h2 className="font-display font-bold text-3xl sm:text-4xl">
              Stop scrolling. Start building.
            </h2>
            <Link
              href="/login?mode=signup"
              className="inline-block mt-8 bg-lime text-bg font-display font-bold px-8 py-3.5 rounded-lg hover:shadow-limeglow transition-shadow"
            >
              Create your account
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center font-mono text-xs text-muted">
          <span>© {new Date().getFullYear()} Founders Hook</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-sm bg-lime rotate-45" />
            <span>Founders<span className="text-purple">Hook</span></span>
          </div>
        </div>
      </footer>
    </main>
  );
}
