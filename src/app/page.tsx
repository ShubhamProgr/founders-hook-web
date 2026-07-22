"use client";

import { motion, Variants } from "framer-motion";
import { 
  Users, 
  Rocket, 
  BarChart3, 
  UserPlus, 
  Handshake, 
  TrendingUp, 
  Sprout, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";
import CursorGlow from "../components/CursorGlow";
import ForgeAnimation from "../components/ForgeAnimation";

export default function Home() {
  // Animation variants for staggered rendering
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden font-sans">
      {/* Background Image Setup */}
      <div className="absolute inset-0 z-0">
        {/* Gradients to fade the image into the dark background smoothly */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] z-10" />
        
        {/* Professional Office Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-right-top bg-no-repeat opacity-40 mix-blend-luminosity"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80')" 
          }}
        />
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-20 pt-28 pb-20 px-6 max-w-7xl mx-auto">
        <CursorGlow />
        {/* floating top-right CTA to mirror the design */}
        <div className="absolute right-6 top-8 hidden md:block">
          <Link href="/onboarding" className="inline-flex items-center gap-3 bg-[#0f0f0f]/60 border border-white/10 text-white px-4 py-2 rounded-full backdrop-blur-md">
            Join the Community
            <ArrowRight size={14} />
          </Link>
        </div>
        
        {/* Hero Section */}
        <motion.div 
          className="flex flex-col lg:flex-row items-center justify-between gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Hero Content */}
          <div className="max-w-2xl">
            <motion.p variants={itemVariants} className="text-[#C59A63] text-xs md:text-sm font-semibold tracking-[0.2em] mb-6">
              BUILD. CONNECT. GROW.
            </motion.p>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.02] mb-6">
              The Exclusive Network <br />
              for <span className="text-[#C59A63]">Startup Founders.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-gray-400 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
              Founders Hook is where ambitious founders connect, collaborate, and grow together. Built for founders, by founders.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
              <Link 
                href="/onboarding" 
                className="group flex items-center gap-2 bg-[#C59A63] hover:bg-[#b08855] text-black px-8 py-4 rounded-lg font-medium transition-all duration-300 cta-glow"
              >
                Join the Community
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 bg-transparent border border-white/20 hover:bg-white/5 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300"
              >
                Explore Founders
              </Link>
            </motion.div>
          </div>

          {/* Right Hero Content (Glowing Text + Visual) */}
          <motion.div variants={itemVariants} className="hidden xl:flex flex-col items-end gap-8 pr-8">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              BUILDING <br />
              THE FUTURE <br />
              TOGETHER
            </h2>

            {/* Decorative small forge animation to echo the hero image */}
            <div className="w-[520px] bg-transparent p-2 rounded-lg float-slow">
              <ForgeAnimation />
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Floating Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 bg-[#111111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-5xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
            
            <div className="flex items-center gap-5 flex-1 justify-center w-full pt-4 md:pt-0">
              <div className="text-[#C59A63]"><Users size={32} strokeWidth={1.5} /></div>
              <div>
                <div className="text-3xl font-bold text-white">2.5K+</div>
                <div className="text-gray-400 text-sm mt-1">Active Founders</div>
              </div>
            </div>

            <div className="flex items-center gap-5 flex-1 justify-center w-full pt-4 md:pt-0">
              <div className="text-[#C59A63]"><Rocket size={32} strokeWidth={1.5} /></div>
              <div>
                <div className="text-3xl font-bold text-white">1.2K+</div>
                <div className="text-gray-400 text-sm mt-1">Startups</div>
              </div>
            </div>

            <div className="flex items-center gap-5 flex-1 justify-center w-full pt-4 md:pt-0">
              <div className="text-[#C59A63]"><BarChart3 size={32} strokeWidth={1.5} /></div>
              <div>
                <div className="text-3xl font-bold text-white">120+</div>
                <div className="text-gray-400 text-sm mt-1">Investor Partners</div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Trusted By Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-20 flex flex-col items-center justify-center w-full max-w-5xl"
        >
          <p className="text-gray-500 text-xs font-semibold tracking-[0.15em] mb-8 uppercase">
            Trusted by leading founders & partners
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 opacity-85">
            <img src="/logos/sequoia.svg" alt="Sequoia" className="h-8 opacity-80" />
            <img src="/logos/accel.svg" alt="Accel" className="h-8 opacity-80" />
            <img src="/logos/a16z.svg" alt="a16z" className="h-8 opacity-80" />
            <img src="/logos/ycombinator.svg" alt="Y Combinator" className="h-8 opacity-80" />
            <img src="/logos/lightspeed.svg" alt="Lightspeed" className="h-8 opacity-80" />
            <img src="/logos/blume.svg" alt="Blume" className="h-8 opacity-80" />
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl"
        >
          {/* Feature 1 */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-[#C59A63] bg-white/5">
              <UserPlus size={22} />
            </div>
            <h3 className="text-base font-semibold text-white">Connect</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Meet and connect with<br/>founders like you.</p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-[#C59A63] bg-white/5">
              <Handshake size={22} />
            </div>
            <h3 className="text-base font-semibold text-white">Collaborate</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Build meaningful<br/>partnerships.</p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-[#C59A63] bg-white/5">
              <TrendingUp size={22} />
            </div>
            <h3 className="text-base font-semibold text-white">Grow</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Access resources and<br/>expert guidance.</p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-[#C59A63] bg-white/5">
              <Sprout size={22} />
            </div>
            <h3 className="text-base font-semibold text-white">Raise</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Connect with investors<br/>and grow faster.</p>
          </motion.div>
        </motion.div>

      </div>
    </main>
  );
}