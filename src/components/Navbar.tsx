import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 font-bold text-lg">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#C59A63] to-[#A855F7] flex items-center justify-center text-black font-semibold">F</div>
            <span className="tracking-tight">Founders Hook</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/80">
          <Link href="#" className="hover:underline">Home</Link>
          <Link href="#" className="hover:underline">Founders</Link>
          <Link href="#" className="hover:underline">Startups</Link>
          <Link href="#" className="hover:underline">Community</Link>
          <Link href="#" className="hover:underline">Resources</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/onboarding" className="hidden md:inline-flex items-center gap-2 bg-[#C59A63] text-black px-4 py-2 rounded-lg font-medium shadow-sm">
            Join the Community
          </Link>
        </div>
      </nav>
    </header>
  );
}
