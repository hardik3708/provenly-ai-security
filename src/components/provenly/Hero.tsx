import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { playClick, playClickSoft, playSuccess, resumeAudio } from "@/lib/sounds";
import { ScrollReveal, TextReveal } from "./animations";

const techNodes = [
  { label: "AI", x: -220, y: -80 },
  { label: "Cloud", x: 220, y: -80 },
  { label: "Zero Trust", x: -280, y: 60 },
  { label: "ML", x: 280, y: 60 },
  { label: "SOC", x: -160, y: 140 },
  { label: "API", x: 160, y: 140 },
];

export default function Hero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        resumeAudio();
        playSuccess();
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#121212]"
    >
      {/* Technical grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="heroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" />
        </svg>
      </div>

      {/* Faint radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#C8442C]/[0.03] rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-28 pb-20 text-center">
        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#8ED7A3] animate-pulse" />
          <span className="text-[12px] font-medium text-white/50 tracking-widest uppercase">
            AI-Powered Cybersecurity
          </span>
        </motion.div>

        {/* Headline with clip reveal */}
        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1.08] tracking-tight text-white max-w-4xl mx-auto overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          >
            AI-powered protection
          </motion.span>
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            for modern{" "}
            <span className="text-[#8ED7A3]">organizations</span>
          </motion.span>
        </h1>

        {/* Supporting copy */}
        <ScrollReveal delay={0.5} distance={20}>
          <p className="mt-6 text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
            Provenly detects threats, secures critical systems, and reduces risk
            across your entire digital infrastructure with predictive AI defense.
          </p>
        </ScrollReveal>

        {/* Buttons */}
        <ScrollReveal delay={0.65} distance={16}>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <a
              href="#contact"
              onClick={() => { resumeAudio(); playClick(); }}
              className="group relative px-7 py-3 bg-[#C8442C] text-white text-sm font-medium rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#C8442C]/20"
            >
              <span className="relative z-10">Get started</span>
              <span className="absolute inset-0 bg-[#B83A24] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
            <a
              href="#about"
              onClick={() => { resumeAudio(); playClickSoft(); }}
              className="px-7 py-3 border border-white/20 text-white/80 text-sm font-medium rounded-full hover:border-white/40 hover:text-white transition-all duration-300"
            >
              Learn more
            </a>
          </div>
        </ScrollReveal>

        {/* Shield + Circuit Network */}
        <div className="relative mt-20 mx-auto" style={{ width: 560, height: 320 }}>
          {/* Circuit lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 560 320"
            fill="none"
          >
            {techNodes.map((node, i) => {
              const cx = 280;
              const cy = 140;
              const nx = 280 + node.x;
              const ny = 140 + node.y;
              return (
                <motion.line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={nx}
                  y2={ny}
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="0.75"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={
                    inView
                      ? { pathLength: 1, opacity: 1 }
                      : { pathLength: 0, opacity: 0 }
                  }
                  transition={{
                    duration: 1.2,
                    delay: 1.2 + i * 0.12,
                    ease: "easeOut",
                  }}
                />
              );
            })}
          </svg>

          {/* Tech nodes */}
          {techNodes.map((node, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: 1.5 + i * 0.1,
                ease: "easeOut",
              }}
              className="absolute flex flex-col items-center gap-1.5"
              style={{
                left: 280 + node.x - 24,
                top: 140 + node.y - 24,
              }}
            >
              <div className="w-10 h-10 rounded-full border border-white/[0.1] bg-white/[0.03] flex items-center justify-center hover:border-white/[0.2] transition-colors duration-300">
                <span className="text-[9px] font-semibold text-white/40 tracking-wider uppercase">
                  {node.label.slice(0, 2)}
                </span>
              </div>
              <span className="text-[10px] text-white/30 font-medium">
                {node.label}
              </span>
            </motion.div>
          ))}

          {/* Central Shield */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 1,
              delay: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[55%]"
          >
            <div className="relative">
              {/* Glow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 1.5, delay: 1.2 }}
                className="absolute inset-0 -m-8 bg-[#8ED7A3]/[0.06] rounded-full blur-2xl"
              />
              {/* Shield body */}
              <div className="relative w-24 h-28 flex items-center justify-center">
                <svg
                  viewBox="0 0 80 96"
                  className="w-full h-full"
                  fill="none"
                >
                  <defs>
                    <linearGradient id="shieldGrad" x1="40" y1="0" x2="40" y2="96" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#3A3A3A" />
                      <stop offset="50%" stopColor="#1E1E1E" />
                      <stop offset="100%" stopColor="#2A2A2A" />
                    </linearGradient>
                    <linearGradient id="shieldSheen" x1="20" y1="0" x2="60" y2="80" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M40 4 L72 16 L72 44 C72 64 56 82 40 92 C24 82 8 64 8 44 L8 16 Z"
                    fill="url(#shieldGrad)"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.75"
                  />
                  <path
                    d="M40 4 L72 16 L72 44 C72 64 56 82 40 92 C24 82 8 64 8 44 L8 16 Z"
                    fill="url(#shieldSheen)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-[#8ED7A3] stroke-[1.5]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none" />
    </section>
  );
}
