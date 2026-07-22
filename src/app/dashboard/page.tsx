import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getSession } from "@/lib/auth";

const feed = [
  {
    name: "Cortex Notes",
    tagline: "AI lecture-notes that actually study for you",
    field: "AI / ML",
    campus: "IIT Delhi",
    roles: 3,
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Loopr",
    tagline: "Campus marketplace for secondhand tech",
    field: "Web Dev",
    campus: "BITS Pilani",
    roles: 5,
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Verdant Labs",
    tagline: "IoT soil sensors for smallholder farms",
    field: "Hardware/IoT",
    campus: "VIT Vellore",
    roles: 2,
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop",
  },
];

export default async function DashboardPage() {
  const session = getSession();
  await dbConnect();
  const user = session ? await User.findById(session.userId).select("-password") : null;

  return (
    <main className="min-h-screen bg-bg noise-bg">
      <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="w-2.5 h-2.5 rounded-sm bg-lime shadow-limeglow rotate-45" />
            <span>Founders<span className="text-lime">Hook</span></span>
          </Link>
          <form action="/api/auth/logout" method="post">
            <button
              formAction="/api/auth/logout"
              className="font-mono text-xs text-muted hover:text-ink border border-line rounded-full px-4 py-1.5 transition-colors"
            >
              Log out
            </button>
          </form>
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-12 pb-6">
        <div className="font-mono text-xs text-lime mb-2">welcome back</div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl">
          Hey {user?.username ?? "there"}, here's what's forging.
        </h1>
        {user?.field && (
          <p className="text-muted mt-3">
            Matched on{" "}
            <span className="text-purple-glow font-mono text-sm border border-purple/30 rounded-full px-2 py-0.5">
              {user.field}
            </span>{" "}
            · {user.experience} ·{" "}
            {Array.isArray(user.skills) && user.skills.length > 0
              ? `${user.skills.length} skills on file`
              : "no skills on file yet"}
          </p>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {feed.map((s) => (
            <div
              key={s.name}
              className="group rounded-xl overflow-hidden card-border bg-panel transition-transform hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={s.img}
                  alt={`${s.name} team at work`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] text-purple-glow border border-purple/30 rounded-full px-2 py-0.5">
                    {s.field}
                  </span>
                  <span className="font-mono text-[11px] text-muted">{s.campus}</span>
                </div>
                <h3 className="font-display font-semibold text-lg">{s.name}</h3>
                <p className="text-muted text-sm mt-1">{s.tagline}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-mono text-lime">{s.roles} roles open</span>
                  <button className="text-xs font-mono text-ink border-b border-transparent hover:border-lime transition-colors">
                    Apply →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-dashed border-line p-8 text-center text-muted font-mono text-sm">
          This is a starter feed — wire up a Startup model and API route next to let
          founders publish real listings here.
        </div>
      </section>
    </main>
  );
}
