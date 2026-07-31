"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Network, Activity, Image as ImageIcon, UploadCloud, CheckCircle2, Trash2 } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

export default function ProjectSetupModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    projectName: "",
    website: "",
    projectDescription: "",
    logoUrl: "",
    bannerUrl: "",
    otherMediaUrls: [] as string[],
  });

  const handleLaunch = () => {
    setStep(5);
    setTimeout(() => {
      console.log("Saving Startup Project:", formData);
      onClose();
    }, 2000);
  };

  // Dynamic network scaling and animation based on the current question/step
  const networkAnim = 
    step === 0 ? { scale: 0.9, y: [0, -4, 0] } :
    step === 1 ? { scale: 1.0, y: [0, -6, 0] } :
    step === 2 ? { scale: 1.05, y: [0, -8, 0] } :
    step === 3 ? { scale: 1.1, y: [0, -10, 0] } :
    step === 4 ? { scale: 1.15, y: [0, -12, 0] } :
    { scale: 1.25 }; // Step 5 (Sync Complete)

  const networkTrans = step === 5 
    ? { duration: 1.8, ease: [0.4, 0, 0.2, 1] } 
    : { duration: 4, repeat: Infinity, ease: "easeInOut" };

  const textGlow = { textShadow: "0 4px 24px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.8)" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={step < 5 ? onClose : undefined} 
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative flex w-full max-w-7xl flex-col items-center overflow-hidden rounded-[28px] border border-white/10 bg-[#09090b] shadow-[0_0_50px_rgba(0,0,0,0.5)] min-h-[640px]"
      >
        {step < 5 && (
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-colors hover:bg-white/15 hover:text-white"
          >
            <X size={18} />
          </button>
        )}

        {/* Animated Background Blur Shapes */}
        <motion.div 
          style={{ filter: "blur(130px)" }}
          animate={{
            x: [0, 60, -40, 30, 0],
            y: [0, -60, 40, -30, 0],
            scale: [1, 1.2, 0.85, 1.1, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -left-20 h-[500px] w-[500px] rounded-full bg-cyan-900/40 pointer-events-none z-0" 
        />
        <motion.div 
          style={{ filter: "blur(140px)" }}
          animate={{
            x: [0, -50, 70, -40, 0],
            y: [0, 40, -60, 30, 0],
            scale: [1, 0.85, 1.25, 0.9, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 left-1/3 h-[500px] w-[500px] rounded-full bg-blue-900/40 pointer-events-none z-0" 
        />
        <motion.div 
          style={{ filter: "blur(120px)" }}
          animate={{
            x: [0, 40, -70, 50, 0],
            y: [0, 60, -40, -50, 0],
            scale: [1, 1.15, 0.9, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 h-[500px] w-[500px] rounded-full bg-indigo-900/40 pointer-events-none z-0" 
        />

        {/* Dynamic Interactive Question Network Node Design */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-visible">
          <motion.div animate={networkAnim} transition={networkTrans} className="relative w-[180%] h-[180%] md:w-[130%] md:h-[130%] mt-32 flex items-center justify-center">
            <svg viewBox="0 0 140 300" className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] opacity-90" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="nodeCore" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="nodeBranch" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#4338ca" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <filter id="nodeGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connecting Branches progressive rendering based on question step */}
              <g stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
                {/* Branch 1: Unlocks at Step 1 (Project Name) */}
                <motion.line x1="70" y1="170" x2="30" y2="110" initial={{ pathLength: 0 }} animate={{ pathLength: step >= 1 ? 1 : 0 }} transition={{ duration: 0.6, ease: "easeOut" }} />
                
                {/* Branch 2: Unlocks at Step 2 (Website) */}
                <motion.line x1="70" y1="170" x2="115" y2="125" initial={{ pathLength: 0 }} animate={{ pathLength: step >= 2 ? 1 : 0 }} transition={{ duration: 0.6, ease: "easeOut" }} />
                
                {/* Branch 3: Unlocks at Step 3 (Description) */}
                <motion.line x1="70" y1="170" x2="45" y2="230" initial={{ pathLength: 0 }} animate={{ pathLength: step >= 3 ? 1 : 0 }} transition={{ duration: 0.6, ease: "easeOut" }} />
                
                {/* Branch 4: Unlocks at Step 4 (Media Upload) */}
                <motion.line x1="70" y1="170" x2="105" y2="215" initial={{ pathLength: 0 }} animate={{ pathLength: step >= 4 ? 1 : 0 }} transition={{ duration: 0.6, ease: "easeOut" }} />
                
                {/* Branch 5: Unlocks at Step 5 (Sync Complete) */}
                <motion.line x1="70" y1="170" x2="20" y2="175" initial={{ pathLength: 0 }} animate={{ pathLength: step >= 5 ? 1 : 0 }} transition={{ duration: 0.6, ease: "easeOut" }} />
              </g>

              {/* Outer Peripheral Node Points lighting up as steps progress */}
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: step >= 1 ? 1 : 0, opacity: step >= 1 ? 1 : 0 }} transition={{ type: "spring", stiffness: 100 }} style={{ originX: "70px", originY: "170px" }}>
                <circle cx="30" cy="110" r={step >= 1 ? 8 : 6} fill="url(#nodeBranch)" filter="url(#nodeGlow)" />
              </motion.g>
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: step >= 2 ? 1 : 0, opacity: step >= 2 ? 1 : 0 }} transition={{ type: "spring", stiffness: 100 }} style={{ originX: "70px", originY: "170px" }}>
                <circle cx="115" cy="125" r={step >= 2 ? 9 : 6} fill="url(#nodeBranch)" filter="url(#nodeGlow)" />
              </motion.g>
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: step >= 3 ? 1 : 0, opacity: step >= 3 ? 1 : 0 }} transition={{ type: "spring", stiffness: 100 }} style={{ originX: "70px", originY: "170px" }}>
                <circle cx="45" cy="230" r={step >= 3 ? 8 : 6} fill="url(#nodeBranch)" filter="url(#nodeGlow)" />
              </motion.g>
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: step >= 4 ? 1 : 0, opacity: step >= 4 ? 1 : 0 }} transition={{ type: "spring", stiffness: 100 }} style={{ originX: "70px", originY: "170px" }}>
                <circle cx="105" cy="215" r={step >= 4 ? 9 : 6} fill="url(#nodeBranch)" filter="url(#nodeGlow)" />
              </motion.g>
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: step >= 5 ? 1 : 0, opacity: step >= 5 ? 1 : 0 }} transition={{ type: "spring", stiffness: 100 }} style={{ originX: "70px", originY: "170px" }}>
                <circle cx="20" cy="175" r={step >= 5 ? 8 : 6} fill="url(#nodeBranch)" filter="url(#nodeGlow)" />
              </motion.g>

              {/* Central Core Node */}
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 120, damping: 12 }}>
                <circle cx="70" cy="170" r={14 + step * 1.5} fill="url(#nodeCore)" filter="url(#nodeGlow)" />
                <motion.circle cx="70" cy="170" r={16 + step * 1.5} fill="none" stroke="#22d3ee" strokeWidth="2" animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
              </motion.g>

              {/* Data Pulse Packets active during final sync */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: step === 5 ? 1 : 0 }} transition={{ duration: 0.3 }}>
                <motion.circle cx="70" cy="170" r="2.5" fill="#fff" filter="url(#nodeGlow)" animate={step === 5 ? { cx: [70, 30], cy: [170, 110], opacity: [0, 1, 0] } : {}} transition={{ duration: 1, repeat: Infinity }} />
                <motion.circle cx="70" cy="170" r="2.5" fill="#fff" filter="url(#nodeGlow)" animate={step === 5 ? { cx: [70, 115], cy: [170, 125], opacity: [0, 1, 0] } : {}} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} />
                <motion.circle cx="70" cy="170" r="2.5" fill="#fff" filter="url(#nodeGlow)" animate={step === 5 ? { cx: [70, 45], cy: [170, 230], opacity: [0, 1, 0] } : {}} transition={{ duration: 0.9, repeat: Infinity, delay: 0.5 }} />
                <motion.circle cx="70" cy="170" r="2.5" fill="#fff" filter="url(#nodeGlow)" animate={step === 5 ? { cx: [70, 105], cy: [170, 215], opacity: [0, 1, 0] } : {}} transition={{ duration: 1.1, repeat: Infinity, delay: 0.1 }} />
              </motion.g>
            </svg>
          </motion.div>
        </div>

        <div className="relative z-10 flex h-full w-full flex-col items-center pt-20 px-8 pb-12">
          <AnimatePresence mode="wait">
            {/* STEP 0 */}
            {step === 0 && (
              <motion.div key="step-0" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="flex flex-col items-center text-center w-full pt-16 md:pt-24">
                <h2 style={textGlow} className="text-4xl font-medium tracking-tight text-white md:text-[44px]">
                  Ready for building your startup network?
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  style={textGlow}
                >
                  Let's hit it on <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center w-full max-w-xl">
                <h3 style={textGlow} className="text-3xl font-medium text-white md:text-4xl">
                  Name your Project
                </h3>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="mt-12 w-full max-w-md rounded-xl border border-white/20 bg-black/40 backdrop-blur-md py-4 px-6 text-center text-xl text-white placeholder:text-gray-400 focus:border-cyan-400 focus:outline-none transition-all shadow-xl"
                  autoFocus
                />
                <div className="mt-12 flex w-full max-w-md items-center justify-between">
                  <button onClick={() => setStep(0)} className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors" style={textGlow}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button 
                    onClick={() => setStep(2)} 
                    disabled={!formData.projectName.trim()} 
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed" 
                    style={textGlow}
                  >
                    Next Phase <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center w-full max-w-xl">
                <h3 style={textGlow} className="text-3xl font-medium text-white md:text-4xl">
                  Do you have a Website?
                </h3>
                <input
                  type="url"
                  placeholder="https://your-startup.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="mt-12 w-full max-w-md rounded-xl border border-white/20 bg-black/40 backdrop-blur-md py-4 px-6 text-center text-xl text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none transition-all shadow-xl"
                  autoFocus
                />
                <div className="mt-12 flex w-full max-w-md items-center justify-between">
                  <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors" style={textGlow}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => {
                        setFormData({ ...formData, website: "" });
                        setStep(3); 
                      }} 
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                      style={textGlow}
                    >
                      No, not yet
                    </button>
                    <button 
                      onClick={() => setStep(3)} 
                      disabled={!formData.website.trim()} 
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      style={textGlow}
                    >
                      Next <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center w-full max-w-2xl">
                <h3 style={textGlow} className="text-3xl font-medium text-white md:text-4xl">
                  Enter a description about your Startup.
                </h3>
                
                <textarea
                  value={formData.projectDescription}
                  onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                  placeholder="Tell us your Startup..."
                  className="mt-10 min-h-[160px] w-full max-w-lg resize-none rounded-xl border border-white/20 bg-black/40 backdrop-blur-md py-4 px-6 text-lg text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none transition-all shadow-xl"
                  autoFocus
                />

                <div className="mt-10 flex w-full max-w-lg items-center justify-between">
                  <button onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors" style={textGlow}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button 
                    onClick={() => setStep(4)} 
                    disabled={!formData.projectDescription.trim()}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    style={textGlow}
                  >
                    Next Phase <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4 - Media Upload */}
            {step === 4 && (
              <motion.div key="step-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center w-full max-w-2xl">
                <h3 style={textGlow} className="text-3xl font-medium text-white md:text-4xl">
                  Upload Startup Media
                </h3>
                
                <div className="mt-10 flex w-full max-w-lg flex-col gap-4">
                  {/* Logo Upload */}
                  <div className="flex items-center justify-between w-full rounded-xl border border-white/20 bg-black/40 backdrop-blur-md p-4 text-white transition-all group">
                    <div className="flex items-center gap-3">
                      {formData.logoUrl ? (
                        <img src={formData.logoUrl} alt="Logo preview" className="h-10 w-10 rounded-md object-cover bg-black" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-cyan-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <span className="font-medium text-gray-200">Startup Logo</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {formData.logoUrl && (
                        <button
                          onClick={() => setFormData({ ...formData, logoUrl: "" })}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Remove Logo"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      <CldUploadWidget 
                        uploadPreset="startup_media"
                        options={{
                          cropping: true,
                          croppingAspectRatio: 1,
                          showSkipCropButton: false,
                          multiple: false,
                          maxFiles: 1,
                          clientAllowedFormats: ["png", "jpeg", "jpg", "webp"]
                        }}
                        onSuccess={(res) => {
                          if (res.info && typeof res.info === 'object') {
                            const url = (res.info as any).secure_url;
                            if (url) setFormData({ ...formData, logoUrl: url });
                          }
                        }}
                      >
                        {({ open }) => (
                          <button 
                            onClick={() => open()}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-sm font-medium text-gray-200 hover:bg-white/20 hover:text-white transition-colors"
                          >
                            {formData.logoUrl ? "Change" : "Upload"} <UploadCloud size={16} />
                          </button>
                        )}
                      </CldUploadWidget>
                    </div>
                  </div>

                  {/* Banner Upload */}
                  <div className="flex items-center justify-between w-full rounded-xl border border-white/20 bg-black/40 backdrop-blur-md p-4 text-white transition-all group">
                    <div className="flex items-center gap-3">
                      {formData.bannerUrl ? (
                        <img src={formData.bannerUrl} alt="Banner preview" className="h-10 w-16 rounded-md object-cover bg-black" />
                      ) : (
                        <div className="flex h-10 w-16 items-center justify-center rounded-md bg-white/10 text-cyan-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <span className="font-medium text-gray-200">Profile Banner</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {formData.bannerUrl && (
                        <button
                          onClick={() => setFormData({ ...formData, bannerUrl: "" })}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Remove Banner"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      <CldUploadWidget 
                        uploadPreset="startup_media"
                        options={{
                          cropping: true,
                          croppingAspectRatio: 3, 
                          showSkipCropButton: false,
                          multiple: false,
                          maxFiles: 1,
                          clientAllowedFormats: ["png", "jpeg", "jpg", "webp"]
                        }}
                        onSuccess={(res) => {
                          if (res.info && typeof res.info === 'object') {
                            const url = (res.info as any).secure_url;
                            if (url) setFormData({ ...formData, bannerUrl: url });
                          }
                        }}
                      >
                        {({ open }) => (
                          <button 
                            onClick={() => open()}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-sm font-medium text-gray-200 hover:bg-white/20 hover:text-white transition-colors"
                          >
                            {formData.bannerUrl ? "Change" : "Upload"} <UploadCloud size={16} />
                          </button>
                        )}
                      </CldUploadWidget>
                    </div>
                  </div>

                  {/* Other Media Upload */}
                  <div className="flex flex-col w-full rounded-xl border border-white/20 bg-black/40 backdrop-blur-md p-4 text-white gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-cyan-400">
                          <ImageIcon size={20} />
                        </div>
                        <span className="font-medium text-gray-200">
                          Other Media {formData.otherMediaUrls.length > 0 && `(${formData.otherMediaUrls.length})`}
                        </span>
                      </div>

                      <CldUploadWidget 
                        uploadPreset="startup_media"
                        options={{ 
                          multiple: true,
                          clientAllowedFormats: ["png", "jpeg", "jpg", "webp"]
                        }}
                        onSuccess={(res) => {
                          if (res.info && typeof res.info === 'object') {
                            const url = (res.info as any).secure_url;
                            if (url) {
                              setFormData(prev => ({ 
                                ...prev, 
                                otherMediaUrls: [...prev.otherMediaUrls, url] 
                              }));
                            }
                          }
                        }}
                      >
                        {({ open }) => (
                          <button 
                            onClick={() => open()}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-sm font-medium text-gray-200 hover:bg-white/20 hover:text-white transition-colors"
                          >
                            Add More <UploadCloud size={16} />
                          </button>
                        )}
                      </CldUploadWidget>
                    </div>

                    {formData.otherMediaUrls.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                        {formData.otherMediaUrls.map((url, index) => (
                          <div key={index} className="relative group h-14 w-14 rounded-lg overflow-hidden border border-white/20 bg-black">
                            <img src={url} alt={`Media ${index + 1}`} className="h-full w-full object-cover" />
                            <button
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  otherMediaUrls: prev.otherMediaUrls.filter((_, i) => i !== index)
                                }));
                              }}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition-opacity"
                              title="Remove image"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-10 flex w-full max-w-lg items-center justify-between">
                  <button onClick={() => setStep(3)} className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors" style={textGlow}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button 
                    onClick={handleLaunch} 
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-3 text-sm font-semibold text-black shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all hover:bg-cyan-400 hover:scale-105"
                  >
                    Activate Network <Network size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <motion.div key="step-5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center pt-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/20 px-4 py-1.5 text-sm font-medium text-cyan-300 backdrop-blur-md">
                  <Activity size={16} /> Sync Complete
                </div>
                <h3 style={textGlow} className="text-4xl font-semibold text-white">
                  Network Online!
                </h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Top-layer Blueprint SVG Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-visible">
          <motion.div animate={networkAnim} transition={networkTrans} className="relative w-[180%] h-[180%] md:w-[130%] md:h-[130%] mt-32 flex items-center justify-center">
            <svg viewBox="0 0 140 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="blueprintGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <g stroke="#22d3ee" strokeWidth="1" strokeDasharray="2 3" fill="none" opacity="0.4" filter="url(#blueprintGlow)">
                <circle cx="70" cy="170" r="18" />
                <circle cx="30" cy="110" r="9" />
                <circle cx="115" cy="125" r="11" />
                <circle cx="45" cy="230" r="8" />
                <circle cx="105" cy="215" r="10" />
                <circle cx="20" cy="175" r="7" />
                <line x1="70" y1="170" x2="30" y2="110" />
                <line x1="70" y1="170" x2="115" y2="125" />
                <line x1="70" y1="170" x2="45" y2="230" />
                <line x1="70" y1="170" x2="105" y2="215" />
                <line x1="70" y1="170" x2="20" y2="175" />
              </g>
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
