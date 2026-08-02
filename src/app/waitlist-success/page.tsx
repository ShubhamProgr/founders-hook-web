import { redirect } from "next/navigation";
import { Check } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    email?: string;
    vipCode?: string;
  }>;
}

export default async function WaitlistSuccessPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const email = resolvedParams.email;
  const vipCode = resolvedParams.vipCode;
  
  if (!email || !vipCode) {
    redirect("/onboarding");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-radial px-6 py-16">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[110px]" />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-ink-900/80 p-8 shadow-card backdrop-blur-xl sm:p-12 text-center">
        
        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/20 border border-gold-500/30 mb-6">
          <Check size={32} className="text-gold-300" />
        </div>

        <h1 className="font-display text-3xl font-semibold text-white mb-4">
          Congratulations!!
        </h1>
        
        <p className="text-base text-mist-400 mb-8 leading-relaxed">
          You have successfully enrolled in our early access. We will contact you via <span className="font-medium text-white">{email}</span>.
        </p>

        {/* VIP Code Box */}
        <div className="bg-ink-950/50 rounded-2xl p-6 border border-white/5 shadow-inner">
          <h3 className="text-xs font-semibold text-mist-500 uppercase tracking-widest mb-3">
            Your Exclusive VIP Code
          </h3>
          <div className="flex items-center justify-center gap-3">
            <div className="text-2xl sm:text-3xl font-bold text-gold-300 tracking-widest font-mono">
              {vipCode}
            </div>
          </div>
          <p className="text-sm text-mist-400 mt-4">
            Save this code! Use it when we launch to claim your early-adopter benefits.
          </p>
        </div>

      </div>
    </main>
  );
}