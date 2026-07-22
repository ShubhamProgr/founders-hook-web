import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="w-2.5 h-2.5 rounded-sm bg-lime shadow-limeglow rotate-45" />
          <span>
            Founders<span className="text-lime">Hook</span>
          </span>
        </Link>
        <div className="flex items-center gap-3 font-mono text-sm">
          <Link
            href="/login"
            className="text-muted hover:text-ink transition-colors px-4 py-2"
          >
            Log in
          </Link>
          <Link
            href="/login?mode=signup"
            className="bg-lime text-bg font-semibold px-4 py-2 rounded-md hover:shadow-limeglow transition-shadow"
          >
            Join now
          </Link>
        </div>
      </nav>
    </header>
  );
}
