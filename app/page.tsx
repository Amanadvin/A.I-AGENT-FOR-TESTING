"use client";
import Link from "next/link";
import { useState, useEffect, useRef, ReactNode, FC } from "react";

// ─── Design Tokens ───────────────────────────────────────────────
const C = {
  primary: "#6d9846",
  primaryDark: "#537832",
  primaryLight: "#8ab85c",
  primaryBg: "#f2f7ed",
  primaryMid: "#d4e8c2",
  ink: "#0d1a05",
  inkMid: "#2d3d20",
  muted: "#6b7a5e",
  subtle: "#9aaa8c",
  border: "#e2ecd8",
  borderMid: "#cddcb8",
  surface: "#ffffff",
  surfaceAlt: "#f7faf4",
  bg: "#fafdf7",
} as const;

// ─── Hooks ────────────────────────────────────────────────────────
function useInView(threshold = 0.12): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  //@ts-ignore
  return [ref, inView];
}

function useScrollY(): number {
  const [y, setY] = useState(0);
  useEffect(() => {
    const fn = () => setY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return y;
}

function useCounter(target: number, active: boolean): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const dur = 1600, fps = 60, steps = (dur / 1000) * fps;
    let i = 0;
    const id = setInterval(() => {
      i++;
      const ease = 1 - Math.pow(1 - i / steps, 3);
      setVal(Math.round(target * ease));
      if (i >= steps) { setVal(target); clearInterval(id); }
    }, 1000 / fps);
    return () => clearInterval(id);
  }, [active, target]);
  return val;
}

// ─── Components ───────────────────────────────────────────────────

interface GlowCardProps {
  children: ReactNode;
  accent?: string;
  style?: React.CSSProperties;
  className?: string;
}
const GlowCard: FC<GlowCardProps> = ({ children, accent = C.primary, style = {} }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.surface,
        border: `1px solid ${hov ? accent + "66" : C.border}`,
        borderRadius: 16,
        padding: "1.75rem",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.3s, box-shadow 0.3s, transform 0.25s",
        boxShadow: hov
          ? `0 0 0 1px ${accent}18, 0 8px 32px ${accent}14, 0 2px 8px rgba(0,0,0,0.05)`
          : "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
        transform: hov ? "translateY(-2px)" : "none",
        ...style,
      }}
    >
      {hov && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          borderRadius: "16px 16px 0 0",
        }} />
      )}
      {children}
    </div>
  );
};

interface BadgeProps { children: ReactNode }
const GreenBadge: FC<BadgeProps> = ({ children }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 7,
    padding: "6px 14px 6px 10px", borderRadius: 999,
    background: C.primaryBg, border: `1px solid ${C.primaryMid}`,
    fontSize: 12, fontFamily: "'Geist', sans-serif", fontWeight: 500,
    color: C.primaryDark, letterSpacing: "0.01em",
    position: "relative", overflow: "hidden",
  }}>
    <span style={{
      position: "absolute", top: 0, left: "-100%", width: "55%", height: "100%",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
      animation: "shimmer 2.8s infinite",
    }} />
    {children}
  </span>
);

interface MagicButtonProps {
  children: ReactNode;
  primary?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
const MagicButton: FC<MagicButtonProps> = ({ children, primary = true, onClick, style = {} }) => {
  const [hov, setHov] = useState(false);
  return primary ? (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 14,
        padding: "11px 24px", borderRadius: 10, border: "none", cursor: "pointer",
        background: hov
          ? `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})`
          : `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`,
        color: "#fff",
        boxShadow: hov
          ? `0 8px 24px ${C.primary}50, 0 2px 8px ${C.primary}30`
          : `0 4px 14px ${C.primary}38`,
        transform: hov ? "translateY(-1px)" : "none",
        transition: "all 0.2s ease",
        letterSpacing: "0.01em",
        ...style,
      }}
    >{children}</button>
  ) : (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'Geist', sans-serif", fontWeight: 500, fontSize: 14,
        padding: "10px 22px", borderRadius: 10, cursor: "pointer",
        background: hov ? C.primaryBg : C.surface,
        color: C.inkMid, border: `1px solid ${hov ? C.primaryMid : C.border}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        transform: hov ? "translateY(-1px)" : "none",
        transition: "all 0.2s ease",
        letterSpacing: "0.01em",
        ...style,
      }}
    >{children}</button>
  );
};

// ─── Terminal Animation ────────────────────────────────────────────
const TERM_LINES: { delay: number; color: string; text: string }[] = [
  { delay: 0, color: "#9aaa8c", text: "$ autotest connect --repo github.com/acme/checkout-app" },
  { delay: 700, color: C.primary, text: "✦ Cloning repository..." },
  { delay: 1400, color: C.inkMid, text: "  → 3 routes detected  ·  42 components mapped" },
  { delay: 2100, color: C.primary, text: "✦ Generating test cases with AI..." },
  { delay: 2800, color: C.inkMid, text: "  → 214 test scenarios synthesized" },
  { delay: 3500, color: C.primary, text: "✦ Launching Browserbase cloud runner..." },
  { delay: 4200, color: C.inkMid, text: "  → Running 214 tests across 6 browsers" },
  { delay: 5000, color: "#4ade80", text: "✓ 211 passed  ·  3 failed  ·  done in 38s" },
];

const TerminalMockup: FC = () => {
  const [visible, setVisible] = useState(0);
  const [started, setStarted] = useState(false);
  const [ref, inView] = useInView(0.3);

  useEffect(() => {
    if (!inView || started) return;
    setStarted(true);
    TERM_LINES.forEach(({ delay }, i) => {
      setTimeout(() => setVisible(v => Math.max(v, i + 1)), delay);
    });
  }, [inView, started]);

  return (
    <div ref={ref} style={{
      background: "#0e1a08", borderRadius: 14, overflow: "hidden",
      border: "1px solid rgba(109,152,70,0.2)",
      boxShadow: `0 24px 64px rgba(13,26,5,0.16), 0 4px 16px rgba(13,26,5,0.08), 0 0 0 1px ${C.primary}18`,
    }}>
      {/* Title bar */}
      <div style={{
        padding: "10px 14px", background: "#0a1205",
        display: "flex", alignItems: "center", gap: 7,
        borderBottom: "1px solid rgba(109,152,70,0.12)",
      }}>
        {["#ff5f57", "#febc2e", "#28c840"].map(c => (
          <span key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c, display: "inline-block" }} />
        ))}
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "#6b7a5e", marginLeft: 8 }}>
          autotest — zsh
        </span>
      </div>
      {/* Lines */}
      <div style={{ padding: "1.25rem 1.5rem", minHeight: 220 }}>
        {TERM_LINES.slice(0, visible).map((l, i) => (
          <div key={i} style={{
            fontFamily: "'Geist Mono', monospace", fontSize: 12.5,
            color: l.color, marginBottom: 5, lineHeight: 1.65,
            animation: "fadeUpLine 0.3s ease",
          }}>
            {l.text}
          </div>
        ))}
        {visible < TERM_LINES.length && (
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13, color: C.primary, animation: "blink 1s steps(1) infinite" }}>▋</span>
        )}
      </div>
    </div>
  );
};

// ─── Pipeline Diagram ─────────────────────────────────────────────
const PIPELINE: { icon: string; label: string; sub: string }[] = [
  { icon: "⬡", label: "GitHub Repo", sub: "Connect & clone" },
  { icon: "✦", label: "AI Analysis", sub: "Map routes + flows" },
  { icon: "⚙", label: "Test Generation", sub: "214 scenarios" },
  { icon: "☁", label: "Browserbase", sub: "Cloud execution" },
  { icon: "✓", label: "Results", sub: "Report + video" },
];

const PipelineViz: FC = () => {
  const [ref, inView] = useInView(0.2);
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
      {PIPELINE.map((p, i) => (
        <div key={p.label} style={{ display: "flex", alignItems: "center", flex: i < PIPELINE.length - 1 ? "1 0 auto" : "0 0 auto" }}>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            minWidth: 96,
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(16px)",
            transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: i === 0 ? C.inkMid : i === PIPELINE.length - 1 ? C.primary : C.primaryBg,
              border: `1px solid ${i === 0 ? "transparent" : i === PIPELINE.length - 1 ? "transparent" : C.primaryMid}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, color: i === 0 || i === PIPELINE.length - 1 ? "#fff" : C.primary,
              boxShadow: i === PIPELINE.length - 1 ? `0 4px 16px ${C.primary}44` : "none",
            }}>
              {p.icon}
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 12, color: C.inkMid }}>{p.label}</div>
              <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: C.subtle, marginTop: 2 }}>{p.sub}</div>
            </div>
          </div>
          {i < PIPELINE.length - 1 && (
            <div style={{
              flex: 1, height: 1, minWidth: 20,
              background: `linear-gradient(90deg, ${C.primaryMid}, ${C.primaryMid})`,
              margin: "0 4px", marginBottom: 28,
              opacity: inView ? 1 : 0,
              transition: `opacity 0.4s ease ${(i + 0.5) * 0.1}s`,
              position: "relative",
            }}>
              <div style={{
                position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)",
                width: 8, height: 8, borderRadius: "50%", background: C.primaryMid,
              }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Stat Counter Cell ────────────────────────────────────────────
interface StatProps { target: number; suffix: string; label: string; active: boolean }
const StatCell: FC<StatProps> = ({ target, suffix, label, active }) => {
  const val = useCounter(target, active);
  return (
    <div style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
      <div style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
        color: C.primary, lineHeight: 1, marginBottom: 8,
      }}>
        {val.toLocaleString()}{suffix}
      </div>
      <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: C.muted }}>{label}</div>
    </div>
  );
};

// ─── Features Data ────────────────────────────────────────────────
interface Feature { icon: string; label: string; body: string; accent: string }
const FEATURES: Feature[] = [
  { icon: "⬡", label: "GitHub Integration", body: "Connect any public or private repo in one click. We clone, analyze your routes, components, and user flows automatically.", accent: C.primary },
  { icon: "✦", label: "AI Test Generation", body: "Our model reads your codebase and synthesizes exhaustive test scenarios — edge cases included — in plain English first.", accent: "#2e7d32" },
  { icon: "☁", label: "Browserbase Execution", body: "Tests run in real cloud browsers via Browserbase. Chrome, Firefox, WebKit — all viewports, zero infrastructure.", accent: "#558b2f" },
  { icon: "🎬", label: "Session Recordings", body: "Every run is recorded. Replay failing tests frame-by-frame to instantly understand what broke and where.", accent: "#33691e" },
  { icon: "🔁", label: "Auto-Healing Tests", body: "When your UI shifts, selectors adapt automatically. No more maintaining brittle XPath strings by hand.", accent: C.primaryDark },
  { icon: "📊", label: "Actionable Reports", body: "Rich diffs, traces, root-cause explanations, and suggested code fixes — not just a pass/fail count.", accent: "#1b5e20" },
];

// ─── Steps Data ───────────────────────────────────────────────────
interface Step { n: string; icon: string; title: string; desc: string }
const STEPS: Step[] = [
  { n: "01", icon: "⬡", title: "Connect your GitHub repo", desc: "Authorize GitHub and select a repository. AutoTest reads your branch, pulls the code, and begins mapping your application structure." },
  { n: "02", icon: "✦", title: "AI generates test cases", desc: "Our model analyzes routes, components, and user flows. It outputs a full test suite — E2E journeys, edge cases, and regression checks." },
  { n: "03", icon: "☁", title: "Browserbase runs the tests", desc: "Tests execute in real browsers on Browserbase's cloud grid. Parallel runs, multiple viewports, full session recordings included." },
  { n: "04", icon: "✓", title: "Review results & iterate", desc: "Get a structured report with pass/fail status, video replays, diffs, and AI-generated fix suggestions. Ship with confidence." },
];

const LOGOS = ["Vercel", "Stripe", "Linear", "Resend", "PlanetScale", "Loom", "Notion", "Figma"];

// ─── Marquee ──────────────────────────────────────────────────────
const Marquee: FC<{ items: string[] }> = ({ items }) => (
  <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
    <div style={{ display: "flex", gap: 56, animation: "marquee 24s linear infinite", width: "max-content" }}>
      {[...items, ...items].map((item, i) => (
        <span key={i} style={{
          fontFamily: "'Geist', sans-serif", fontSize: 14, fontWeight: 500,
          color: C.subtle, whiteSpace: "nowrap", letterSpacing: "0.01em",
        }}>{item}</span>
      ))}
    </div>
  </div>
);

// ─── Dot Grid Background ──────────────────────────────────────────
const DotGrid: FC = () => (
  <div style={{
    position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage: `radial-gradient(circle, ${C.primaryMid} 1px, transparent 1px)`,
    backgroundSize: "28px 28px",
    maskImage: "radial-gradient(ellipse 75% 55% at 50% 0%, black 0%, transparent 100%)",
  }} />
);

// ─── Orbs ─────────────────────────────────────────────────────────
const Orbs: FC = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
    <div style={{ position: "absolute", top: "-8%", right: "-6%", width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, ${C.primary}14 0%, transparent 70%)` }} />
    <div style={{ position: "absolute", top: "40%", left: "-6%", width: 380, height: 380, borderRadius: "50%", background: `radial-gradient(circle, ${C.primaryLight}0e 0%, transparent 70%)` }} />
    <div style={{ position: "absolute", bottom: "8%", right: "20%", width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, ${C.primaryDark}0a 0%, transparent 70%)` }} />
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════
const AutoTestLanding: FC = () => {
  const scrollY = useScrollY();
  const [heroRef, heroIn] = useInView(0.05);
  const [featRef, featIn] = useInView(0.1);
  const [stepsRef, stepsIn] = useInView(0.1);
  const [statsRef, statsIn] = useInView(0.3);
  const scrolled = scrollY > 30;

  const anim = (inView: boolean, delay = 0, from = "translateY(20px)"): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "none" : from,
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  });

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes shimmer    { 0%{left:-100%} 100%{left:200%} }
        @keyframes fadeUpLine { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes marquee    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${C.primaryMid}; color: ${C.primaryDark}; }
        html { scroll-behavior: smooth; }
      `}</style>

      <div style={{ fontFamily: "'Geist', sans-serif", background: C.bg, color: C.ink, minHeight: "100vh" }}>

        {/* ── NAV ── */}
        <header style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? "rgba(247,250,244,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(18px) saturate(180%)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
          transition: "all 0.4s ease",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, boxShadow: `0 4px 12px ${C.primary}44`,
              }}>⚡</div>
              <span style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 16, letterSpacing: "-0.02em", color: C.ink }}>AutoTest</span>
              <span style={{
                fontFamily: "'Geist Mono', monospace", fontSize: 10, fontWeight: 500,
                color: C.primary, background: C.primaryBg, border: `1px solid ${C.primaryMid}`,
                borderRadius: 6, padding: "2px 7px", letterSpacing: "0.04em",
              }}>AI</span>
            </div>

            {/* Nav links */}
            <nav style={{ display: "flex", gap: 2 }}>
              {(["Features", "How it works", "Docs"] as string[]).map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                  style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: C.muted, textDecoration: "none", padding: "6px 14px", borderRadius: 8, transition: "color 0.2s, background 0.2s" }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.color = C.ink; (e.target as HTMLElement).style.background = C.primaryBg; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.color = C.muted; (e.target as HTMLElement).style.background = "transparent"; }}
                >{l}</a>
              ))}
            </nav>

            {/* CTA */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Link href={'/workspace'}>
                <button style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: C.muted, background: "transparent", border: "none", cursor: "pointer", padding: "6px 12px" }}>Sign in</button>
                <MagicButton>Connect GitHub →</MagicButton>
              </Link>
            </div>
          </div>
        </header>

        {/* ── HERO ── */}
        <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "7rem 2rem 4rem", position: "relative", overflow: "hidden" }}>
          <DotGrid />
          <Orbs />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto" }}>
            {/* Badge */}
            <div style={{ marginBottom: 24, ...anim(heroIn, 0) }}>
              <GreenBadge>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary, display: "inline-block", animation: "blink 1.6s infinite" }} />
                Powered by AI + Browserbase — now in beta
              </GreenBadge>
            </div>

            {/* H1 */}
            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(3rem, 7.5vw, 6.5rem)",
              lineHeight: 1.02, letterSpacing: "-0.035em",
              color: C.ink, marginBottom: "1.4rem",
              ...anim(heroIn, 0.1),
            }}>
              Connect repo.<br />
              <span style={{
                background: `linear-gradient(135deg, ${C.primaryDark} 0%, ${C.primary} 50%, ${C.primaryLight} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>AI tests it.</span>
            </h1>

            {/* Sub */}
            <p style={{
              fontSize: "clamp(1rem, 1.8vw, 1.2rem)", color: C.muted, lineHeight: 1.7,
              maxWidth: 560, margin: "0 auto 2.5rem",
              ...anim(heroIn, 0.2),
            }}>
              Connect your GitHub repository, let our AI generate a complete test suite, and watch Browserbase execute them across real cloud browsers — all in minutes.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem", ...anim(heroIn, 0.3) }}>
              <MagicButton>⬡ Connect GitHub repo →</MagicButton>
              <MagicButton primary={false}>▶ Watch 2-min demo</MagicButton>
            </div>

            {/* Trust chips */}
            <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", ...anim(heroIn, 0.4) }}>
              {["No credit card required", "Works with any Next.js / React app", "Browserbase cloud included"].map(t => (
                <span key={t} style={{ fontFamily: "'Geist', sans-serif", fontSize: 12.5, color: C.subtle, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: C.primary, fontWeight: 700 }}>✓</span> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Terminal */}
          <div style={{
            maxWidth: 700, width: "100%", margin: "4rem auto 0",
            position: "relative", zIndex: 1,
            animation: heroIn ? "float 5s ease-in-out infinite" : "none",
            ...anim(heroIn, 0.55),
          }}>
            <div style={{ position: "absolute", inset: -1, borderRadius: 16, background: `linear-gradient(135deg, ${C.primary}44, ${C.primaryLight}22)`, filter: "blur(20px)", zIndex: -1 }} />
            <TerminalMockup />
          </div>
        </section>

        {/* ── PIPELINE ── */}
        <section style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "3.5rem 2rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.subtle, textAlign: "center", marginBottom: "2.5rem" }}>How it flows</p>
            <PipelineViz />
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div style={{ background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, padding: "1.25rem 0" }}>
          <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.border, textAlign: "center", marginBottom: "1rem" }}>Trusted by teams building on</p>
          <Marquee items={LOGOS} />
        </div>

        {/* ── STATS ── */}
        <div ref={statsRef} style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2rem 3rem" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden",
            boxShadow: "0 2px 12px rgba(13,26,5,0.05)",
            gap: 0,
          }}>
            {([
              { target: 99, suffix: "%", label: "Test accuracy rate" },
              { target: 214, suffix: "+", label: "Avg scenarios generated" },
              { target: 2400, suffix: "+", label: "Repos connected" },
              { target: 38, suffix: "s", label: "Avg full suite runtime" },
            ] as { target: number; suffix: string; label: string }[]).map((s, i) => (
              <div key={s.label} style={{ borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
                <StatCell {...s} active={statsIn} />
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section id="features" ref={featRef} style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 2rem 5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <GreenBadge>Capabilities</GreenBadge>
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em",
              color: C.ink, marginTop: 16, lineHeight: 1.1,
            }}>
              Everything in one pipeline
            </h2>
            <p style={{ fontSize: 15, color: C.muted, marginTop: 12, maxWidth: 480, margin: "12px auto 0", lineHeight: 1.65 }}>
              From your first commit to a passing test suite — no DevOps, no config, no brittle scripts.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
            {FEATURES.map((f, i) => (
              <GlowCard key={f.label} accent={f.accent} style={{
                ...anim(featIn, i * 0.08),
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                  background: C.primaryBg, border: `1px solid ${C.primaryMid}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, color: f.accent,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 15.5, color: C.ink, marginBottom: 8 }}>{f.label}</h3>
                <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 13.5, color: C.muted, lineHeight: 1.65 }}>{f.body}</p>
              </GlowCard>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" ref={stepsRef} style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "5rem 2rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <GreenBadge>Process</GreenBadge>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", color: C.ink, marginTop: 16, lineHeight: 1.1 }}>
                Zero to tested in four steps
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              {STEPS.map((s, i) => (
                <div key={s.n} style={anim(stepsIn, i * 0.12)}>
                  <GlowCard accent={C.primary} style={{ height: "100%" }}>
                    {/* Step number + icon */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                      <span style={{
                        fontFamily: "'Geist Mono', monospace", fontSize: 11, fontWeight: 600,
                        color: C.primary, background: C.primaryBg, border: `1px solid ${C.primaryMid}`,
                        borderRadius: 6, padding: "3px 8px", letterSpacing: "0.06em",
                      }}>{s.n}</span>
                      <span style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: C.primaryBg, border: `1px solid ${C.primaryMid}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 17, color: C.primary,
                      }}>{s.icon}</span>
                    </div>
                    <h3 style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 15.5, color: C.ink, marginBottom: 10, lineHeight: 1.3 }}>{s.title}</h3>
                    <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 13.5, color: C.muted, lineHeight: 1.65 }}>{s.desc}</p>
                  </GlowCard>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BROWSERBASE CALLOUT ── */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20,
            padding: "3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem",
            alignItems: "center", boxShadow: "0 4px 24px rgba(13,26,5,0.06)",
          }}>
            <div>
              <GreenBadge>Powered by Browserbase</GreenBadge>
              <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: C.ink, marginTop: 16, marginBottom: 14, lineHeight: 1.15, letterSpacing: "-0.025em" }}>
                Real browsers.<br />Zero infrastructure.
              </h3>
              <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 14.5, color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
                We use Browserbase to spin up headless Chrome, Firefox, and WebKit instances in the cloud. Your tests run in authentic browser environments — no Selenium grids to manage, no Docker to configure.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  "Parallel execution across 6 browser types",
                  "Full session replay with video + network trace",
                  "Real device emulation & geolocation testing",
                  "Automatic screenshots on failure",
                ].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontFamily: "'Geist', sans-serif", fontSize: 13.5, color: C.inkMid }}>
                    <span style={{ width: 20, height: 20, borderRadius: "50%", background: C.primaryBg, border: `1px solid ${C.primaryMid}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.primary, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Mini metrics panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "checkout flow", passed: 48, failed: 2, pct: 96 },
                { label: "auth routes", passed: 31, failed: 0, pct: 100 },
                { label: "product pages", passed: 62, failed: 5, pct: 93 },
                { label: "cart & payment", passed: 29, failed: 1, pct: 97 },
              ].map(r => (
                <div key={r.label} style={{
                  background: C.surfaceAlt, border: `1px solid ${C.border}`,
                  borderRadius: 12, padding: "1rem 1.25rem",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: C.inkMid }}>{r.label}</span>
                    <div style={{ display: "flex", gap: 8, fontSize: 12, fontFamily: "'Geist', sans-serif" }}>
                      <span style={{ color: C.primary, fontWeight: 600 }}>✓ {r.passed}</span>
                      {r.failed > 0 && <span style={{ color: "#d32f2f", fontWeight: 600 }}>✗ {r.failed}</span>}
                    </div>
                  </div>
                  <div style={{ background: C.border, borderRadius: 99, height: 5, overflow: "hidden" }}>
                    <div style={{ width: `${r.pct}%`, height: "100%", background: r.pct === 100 ? C.primary : `linear-gradient(90deg, ${C.primary}, ${C.primaryLight})`, borderRadius: 99, transition: "width 1s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "1rem 2rem 6rem" }}>
          <div style={{
            maxWidth: 900, margin: "0 auto", position: "relative",
            background: `linear-gradient(145deg, ${C.primaryDark}, ${C.primary})`,
            borderRadius: 24, padding: "4.5rem 3rem", textAlign: "center",
            boxShadow: `0 32px 80px ${C.primary}30, 0 8px 24px ${C.primary}20`,
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: "-25%", right: "-8%", width: 360, height: 360, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-20%", left: "-4%", width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ marginBottom: 20 }}>
                <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 999, padding: "5px 14px", fontSize: 12, fontFamily: "'Geist', sans-serif", fontWeight: 500, color: "rgba(255,255,255,0.9)", letterSpacing: "0.04em" }}>
                  ⚡ Ready when you are
                </span>
              </div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(2rem, 5vw, 3.4rem)", color: "#fff", marginBottom: 16, letterSpacing: "-0.03em", lineHeight: 1.08 }}>
                Ship with confidence.<br />
                <em>Always.</em>
              </h2>
              <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 15.5, color: "rgba(255,255,255,0.72)", maxWidth: 460, margin: "0 auto 2.5rem", lineHeight: 1.65 }}>
                Connect your GitHub repo and have a full AI-generated test suite running in Browserbase within minutes.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button style={{
                  fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 14,
                  padding: "13px 28px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: "#fff", color: C.primaryDark,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(0,0,0,0.15)"; }}
                >⬡ Connect GitHub →</button>
                <button style={{
                  fontFamily: "'Geist', sans-serif", fontWeight: 500, fontSize: 14,
                  padding: "13px 28px", borderRadius: 10, cursor: "pointer",
                  background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)",
                  color: "#fff", backdropFilter: "blur(8px)",
                  transition: "background 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"}
                >Read the docs</button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: `1px solid ${C.border}`, padding: "2.5rem 2rem", background: C.surface }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${C.primaryDark}, ${C.primary})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>⚡</div>
              <span style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 15, color: C.ink }}>AutoTest AI</span>
            </div>
            <span style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: C.subtle }}>
              © {new Date().getFullYear()} AutoTest AI. All rights reserved.
            </span>
            <div style={{ display: "flex", gap: 24 }}>
              {(["Terms", "Privacy", "Contact", "Docs"] as string[]).map(l => (
                <a key={l} href="#" style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: C.subtle, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = C.ink}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = C.subtle}
                >{l}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AutoTestLanding;