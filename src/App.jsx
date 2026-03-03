import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, MessageSquare, Search, FileText, ChevronLeft, ChevronRight, Leaf } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const RED = "#E8192C";

const steps = [
  { id: 1, icon: MessageSquare, label: "The Ask",       sub: "User queries harvest policy" },
  { id: 2, icon: Search,        label: "The Retrieval", sub: "RAG engine fetches internal docs" },
  { id: 3, icon: FileText,      label: "The Result",    sub: "AI answers with citations & preview" },
];

// ─── Slide transition variants ────────────────────────────────────────────────
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center:       ({ x: 0, opacity: 1 }),
  exit:  (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};
const slideTransition = { duration: 0.55, ease: [0.32, 0.72, 0, 1] };

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ onDotClick, current, total }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(232,25,44,0.1)", border: "1px solid rgba(232,25,44,0.2)" }}>
          <Leaf size={15} style={{ color: RED }} />
        </div>
        <div>
          <p className="text-gray-900 font-semibold text-sm leading-none tracking-tight">Sinarmas</p>
          <p className="text-gray-400 text-[10px] leading-none mt-0.5 tracking-widest uppercase">Agribusiness &amp; Food</p>
        </div>
      </div>

      {/* Dot nav */}
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); onDotClick(i); }}
            className="transition-all duration-300 rounded-full"
            style={{
              width:  current === i ? 20 : 8,
              height: 8,
              background: current === i ? RED : "rgba(0,0,0,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Slide 1 — Hero ───────────────────────────────────────────────────────────
function SlideHero({ goTo }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      {/* Glow */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(232,25,44,0.05), transparent)" }} />

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-10">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: RED }} />
          <span className="text-gray-500 text-xs tracking-[0.2em] uppercase">Internal RAG Chatbot · 2026</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.92] mb-6">
          <span className="text-gray-900">Upstream</span><br />
          <span className="text-gradient">Operational Guideline</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 text-lg sm:text-xl font-light max-w-xl mx-auto leading-relaxed mb-12">
          How a single prompt unlocks institutional knowledge.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); goTo(1); }}
            className="group flex items-center gap-2.5 font-semibold text-sm px-6 py-3 rounded-full transition-all duration-300"
            style={{ background: RED, color: "#fff" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 32px rgba(232,25,44,0.4)"; e.currentTarget.style.background = "#ff2d42"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = RED; }}
          >
            <Play size={14} fill="currentColor" />
            Watch the Demo
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Video Player ─────────────────────────────────────────────────────────────
function VideoPlayer() {
  const videoRef    = useRef(null);
  const [playing, setPlaying]       = useState(false);
  const [progress, setProgress]     = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const hideTimer = useRef(null);

  const stepPcts = [0, 0.1, 0.25];

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    setShowUI(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowUI(false), 2500);
  }, []);

  const [showUI, setShowUI] = useState(true);
  useEffect(() => () => clearTimeout(hideTimer.current), []);

  // Auto-play on mount
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  // Sync progress
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      const pct = v.duration ? v.currentTime / v.duration : 0;
      setProgress(pct);
      const idx = [...stepPcts].reverse().findIndex(p => pct >= p);
      if (idx !== -1) setActiveStep(3 - idx);
    };
    const onEnd = () => { setPlaying(false); setShowUI(true); };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    return () => { v.removeEventListener("timeupdate", onTime); v.removeEventListener("ended", onEnd); };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else          { v.pause(); setPlaying(false); }
    resetHideTimer();
  };

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 w-full max-w-6xl mx-auto">
      {/* Step list */}
      <div className="lg:w-52 flex-shrink-0 flex flex-col gap-1 lg:sticky lg:top-28">
        <p className="text-gray-400 text-[10px] tracking-widest uppercase mb-2 px-3">Journey</p>
        {steps.map((s) => {
          const Icon   = s.icon;
          const active = activeStep === s.id;
          const done   = activeStep > s.id;
          return (
            <motion.div key={s.id} animate={{ opacity: active ? 1 : done ? 0.5 : 0.25 }} transition={{ duration: 0.4 }}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-xl ${active ? "glass-strong" : ""}`}>
              <div className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
                style={{ background: active ? "rgba(232,25,44,0.1)" : "rgba(0,0,0,0.04)", border: `1px solid ${active ? "rgba(232,25,44,0.3)" : "rgba(0,0,0,0.08)"}` }}>
                <Icon size={13} style={{ color: active ? RED : "rgba(0,0,0,0.3)" }} />
              </div>
              <div>
                <p className="text-xs font-semibold leading-none mb-1" style={{ color: active ? "#111" : "rgba(0,0,0,0.35)" }}>
                  Step {s.id} — {s.label}
                </p>
                <p className="text-[11px] text-gray-400 leading-snug">{s.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Video */}
      <div className="flex-1 min-w-0"
        onMouseMove={resetHideTimer}
        onMouseEnter={resetHideTimer}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative rounded-2xl overflow-hidden video-shadow cursor-pointer" onClick={togglePlay}>
          <div className="overflow-hidden" style={{ margin: '-3% 3% -3% 0' }}>
            <video ref={videoRef} src="../vid/0303.mp4" muted playsInline preload="metadata"
              className="w-full block" />
          </div>

          {/* Controls bar */}
          <AnimatePresence>
            {showUI && !playing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.35)" }}>
                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 rounded-full glass-strong flex items-center justify-center">
                  <Play size={22} fill="white" className="text-white" style={{ marginLeft: 3 }} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>


    </div>
  );
}

// ─── Slide 2 — Video Demo ─────────────────────────────────────────────────────
function SlideDemo() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 py-10 overflow-hidden" onClick={e => e.stopPropagation()}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="text-center mb-6 flex-shrink-0">
        <p className="text-3xl sm:text-4xl font-black tracking-tighter" style={{ color: RED }}>Live Walkthrough</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
        className="w-full flex-1 min-h-0 flex items-center">
        <VideoPlayer />
      </motion.div>
    </div>
  );
}

// ─── Carousel Shell ───────────────────────────────────────────────────────────
const SLIDES = [SlideHero, SlideDemo];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir]         = useState(1);

  const goTo = (idx) => {
    if (idx === current) return;
    setDir(idx > current ? 1 : -1);
    setCurrent(idx);
  };
  const prev = () => goTo(Math.max(0, current - 1));
  const next = () => goTo(Math.min(SLIDES.length - 1, current + 1));

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  const Slide = SLIDES[current];

  return (
    <div
      className="w-screen h-screen overflow-hidden bg-white font-sans relative cursor-pointer"
      onClick={next}
    >
      <Navbar onDotClick={goTo} current={current} total={SLIDES.length} />

      {/* Slides */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={current}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          className="absolute inset-0"
        >
          <Slide goTo={goTo} />
        </motion.div>
      </AnimatePresence>

      {/* Arrow nav */}
      {current > 0 && (
        <button onClick={e => { e.stopPropagation(); prev(); }}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-400 transition-colors shadow-sm">
          <ChevronLeft size={18} />
        </button>
      )}
      {current < SLIDES.length - 1 && (
        <button onClick={e => { e.stopPropagation(); next(); }}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-400 transition-colors shadow-sm">
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
