import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
  useSpring,
} from "framer-motion";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const colors = {
  bg: "#080c14",
  surface: "#0d1421",
  surfaceHigh: "#111827",
  border: "#1e2d45",
  cyan: "#00d4ff",
  cyanDim: "#00d4ff22",
  cyanMid: "#00d4ff55",
  gold: "#f59e0b",
  purple: "#a78bfa",
  green: "#34d399",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#94a3b8",
};

// ─── REAL CONTACT INFO ────────────────────────────────────────────────────────
const CONTACT = {
  email: "yadavbikash179@gmail.com",
  github: "https://github.com/Monster-Here",
  githubHandle: "github.com/Monster-Here",
  linkedin: "https://www.linkedin.com/in/bikash-y-832048130",
  linkedinHandle: "linkedin.com/in/bikash-y-832048130",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["About", "Education", "Skills", "Projects", "Contact"];

const EDUCATION = [
  {
    degree: "Master of Computer Applications",
    short: "MCA",
    sub: "PG",
    institution: "Krupanidhi College of Management",
    location: "Bengaluru, Karnataka",
    period: "2023 — Present",
    status: "current",
    icon: "◈",
    color: colors.cyan,
    highlights: [
      "Pursuing postgraduate degree in computer applications with focus on modern software development",
      "Building full-stack projects using React, Flask, and PostgreSQL as part of coursework",
      "Deepening expertise in algorithms, system design, and software engineering principles",
    ],
  },
  {
    degree: "Bachelor of Computer Applications",
    short: "BCA",
    sub: "UG",
    institution: "GIET Degree College",
    location: "Rajamahendravaram, Andhra Pradesh",
    period: "2020 — 2023",
    status: "completed",
    icon: "◉",
    color: colors.purple,
    highlights: [
      "Completed undergraduate degree in computer applications",
      "Built strong foundations in programming, data structures, and web technologies",
      "Developed passion for full-stack development and backend system design",
    ],
  },
];

const SKILLS = [
  { category: "Frontend", icon: "◈", items: ["HTML5", "CSS3", "JavaScript", "React"], color: colors.cyan },
  { category: "Backend",  icon: "◉", items: ["Flask", "REST APIs", "JWT Auth", "Python"], color: colors.purple },
  { category: "Database", icon: "◐", items: ["PostgreSQL", "SQLite", "Schema Design", "ORM"], color: colors.green },
  { category: "Tools",    icon: "◎", items: ["Git", "GitHub", "VS Code", "Postman"], color: colors.gold },
];

const PROJECTS = [
  {
    id: 1, title: "Task Manager App", status: "live",
    description: "Full-stack task management system with secure JWT authentication, complete CRUD operations, and PostgreSQL as the primary data store. Built for real-world productivity workflows.",
    tech: ["React", "Flask", "PostgreSQL", "JWT"],
    github: CONTACT.github, demo: "#", highlight: colors.cyan,
  },
  {
    id: 2, title: "Expense Tracker", status: "live",
    description: "Interactive expense tracking application featuring an analytics dashboard with visual breakdowns, category tagging, and monthly spending summaries.",
    tech: ["React", "Flask", "SQLite", "Chart.js"],
    github: CONTACT.github, demo: "#", highlight: colors.purple,
  },
  {
    id: 3, title: "Timetable Generator", status: "live",
    description: "Dynamic scheduling tool that processes user inputs to auto-generate optimized timetables. Handles conflict detection and priority-based slot assignment.",
    tech: ["React", "Python", "Flask", "PostgreSQL"],
    github: CONTACT.github, demo: "#", highlight: colors.green,
  },
  {
    id: 4, title: "AI Resume Builder", status: "soon",
    description: "AI-powered resume builder that generates professional, tailored content using language models. Smart section suggestions and real-time preview.",
    tech: ["React", "OpenAI API", "Flask", "PostgreSQL"],
    github: null, demo: null, highlight: colors.gold,
  },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useScrollSpy(ids) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const fn = () => {
      const y = window.scrollY + 120;
      let cur = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [ids]);
  return active;
}

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function GridNoise() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      backgroundImage: `linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px)`,
      backgroundSize: "60px 60px",
    }} />
  );
}

function GlowOrb({ x, y, color = "#00d4ff", size = 400, opacity = 0.08 }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      width: size, height: size, borderRadius: "50%",
      background: color, filter: "blur(120px)", opacity,
      pointerEvents: "none", transform: "translate(-50%,-50%)",
    }} />
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.25em", color: colors.cyan, textTransform: "uppercase" }}>
        {children}
      </span>
      <div style={{ height: 1, width: 60, background: colors.cyanMid }} />
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontFamily: "'Syne',serif", fontSize: "clamp(36px,6vw,64px)",
      fontWeight: 800, letterSpacing: "-0.03em", color: colors.text,
      marginBottom: 60, lineHeight: 1,
    }}>
      {children}
    </h2>
  );
}

// ─── SCROLL PROGRESS BAR ─────────────────────────────────────────────────────
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 2,
      background: `linear-gradient(to right, ${colors.cyan}, ${colors.purple})`,
      transformOrigin: "left", scaleX, zIndex: 200,
    }} />
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useScrollSpy(["about", "education", "skills", "projects", "contact"]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(20px,5vw,80px)", height: 70,
          background: scrolled ? "rgba(8,12,20,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? `1px solid ${colors.border}` : "none",
          transition: "all 0.3s ease",
        }}
      >
        <button aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <span style={{ fontFamily: "'Syne',serif", fontSize: 22, fontWeight: 800, color: colors.text, letterSpacing: "-0.02em" }}>
            BY<span style={{ color: colors.cyan }}>.</span>
          </span>
        </button>

        <div className="desktop-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {NAV_LINKS.map((link) => {
            const id = link.toLowerCase();
            const isActive = active === id;
            return (
              <button key={link} onClick={() => scrollTo(id)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: "0.05em",
                color: isActive ? colors.cyan : colors.textDim,
                transition: "color 0.2s", position: "relative", padding: "4px 0",
              }}>
                {link}
                {isActive && (
                  <motion.div layoutId="nav-indicator" style={{
                    position: "absolute", bottom: -2, left: 0, right: 0,
                    height: 1, background: colors.cyan,
                  }} />
                )}
              </button>
            );
          })}
          <button onClick={() => scrollTo("contact")} style={{
            background: "transparent", border: `1px solid ${colors.cyan}`,
            color: colors.cyan, padding: "8px 20px", borderRadius: 4,
            fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: "0.08em",
            cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = colors.cyanDim; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
            Hire Me
          </button>
        </div>

        <button className="mobile-menu-btn" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", background: "none", border: "none", cursor: "pointer",
          flexDirection: "column", gap: 5, padding: 4,
        }}>
          {[0,1,2].map((i) => (
            <motion.div key={i}
              animate={{
                rotate: menuOpen && i===0 ? 45 : menuOpen && i===2 ? -45 : 0,
                y: menuOpen && i===0 ? 9 : menuOpen && i===2 ? -9 : 0,
                opacity: menuOpen && i===1 ? 0 : 1,
              }}
              style={{ width: 24, height: 2, background: colors.text, borderRadius: 2, transformOrigin: "center" }}
            />
          ))}
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed", top: 70, left: 0, right: 0, zIndex: 99,
              background: "rgba(8,12,20,0.98)", backdropFilter: "blur(20px)",
              borderBottom: `1px solid ${colors.border}`,
              padding: "20px clamp(20px,5vw,80px)", display: "flex", flexDirection: "column", gap: 4,
            }}>
            {NAV_LINKS.map((link) => (
              <button key={link} onClick={() => scrollTo(link.toLowerCase())} style={{
                background: "none", border: "none", textAlign: "left", cursor: "pointer",
                fontFamily: "'JetBrains Mono',monospace", fontSize: 15, color: colors.textDim,
                padding: "12px 0", borderBottom: `1px solid ${colors.border}`,
              }}>
                {link}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      position: "relative", overflow: "hidden",
      padding: "0 clamp(20px,8vw,120px)",
    }}>
      <GlowOrb x="10%" y="30%" color={colors.cyan} size={600} opacity={0.07} />
      <GlowOrb x="80%" y="60%" color={colors.purple} size={400} opacity={0.06} />
      <div style={{
        position: "absolute", left: "clamp(20px,8vw,120px)", top: 0, bottom: 0,
        width: 1, background: `linear-gradient(to bottom, transparent, ${colors.cyanMid}, transparent)`,
      }} />

      <motion.div style={{ y, opacity, position: "relative", zIndex: 1, maxWidth: 900 }}>
        {/* Available badge */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: colors.cyan,
            letterSpacing: "0.2em", marginBottom: 20, marginLeft: 24,
            display: "flex", alignItems: "center", gap: 10,
          }}>
          <span style={{
            display: "inline-block", width: 8, height: 8, borderRadius: "50%",
            background: colors.cyan, boxShadow: `0 0 12px ${colors.cyan}`,
            animation: "pulse 2s infinite",
          }} />
          AVAILABLE FOR WORK
        </motion.div>

        {/* Name */}
        <div style={{
          fontFamily: "'Syne',serif", fontSize: "clamp(52px,10vw,110px)",
          fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em", marginBottom: 22,
        }}>
          {["Bikash", "Yadav"].map((word, wi) => (
            <div key={wi} style={{ overflow: "hidden" }}>
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.3 + wi * 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ color: wi === 1 ? colors.cyan : colors.text, display: "block" }}>
                {word}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: "clamp(13px,1.8vw,17px)",
            color: colors.textDim, marginBottom: 12, letterSpacing: "0.02em",
          }}>
          Full Stack Developer{" "}
          <span style={{ color: colors.cyan }}>
            React <span style={{ color: colors.textMuted }}>•</span> Flask{" "}
            <span style={{ color: colors.textMuted }}>•</span> PostgreSQL
          </span>
        </motion.div>

        {/* Education pill */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `${colors.purple}18`, border: `1px solid ${colors.purple}44`,
            borderRadius: 100, padding: "5px 14px", marginBottom: 18,
          }}>
          <span style={{ fontSize: 10, color: colors.purple }}>▲</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: colors.purple, letterSpacing: "0.05em" }}>
            MCA Student · Krupanidhi College of Management, Bengaluru
          </span>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          style={{
            fontSize: "clamp(15px,1.6vw,18px)", color: colors.textDim,
            maxWidth: 520, lineHeight: 1.7, marginBottom: 40,
            fontFamily: "'DM Sans',sans-serif",
          }}>
          I build scalable web applications with modern technologies — from interactive frontends to robust APIs.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.05 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: colors.cyan, color: colors.bg, border: "none",
              padding: "14px 30px", borderRadius: 4, fontFamily: "'JetBrains Mono',monospace",
              fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer",
              transition: "all 0.2s", boxShadow: `0 0 30px ${colors.cyanMid}`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 0 50px ${colors.cyan}88`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 0 30px ${colors.cyanMid}`; }}>
            View Projects →
          </button>
          <a href={`mailto:${CONTACT.email}`}
            style={{
              background: "transparent", color: colors.text, border: `1px solid ${colors.border}`,
              padding: "14px 30px", borderRadius: 4, fontFamily: "'JetBrains Mono',monospace",
              fontSize: 13, letterSpacing: "0.08em", cursor: "pointer",
              transition: "all 0.2s", textDecoration: "none", display: "inline-flex", alignItems: "center",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.cyan; e.currentTarget.style.color = colors.cyan; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.text; }}>
            Contact Me
          </a>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer"
            style={{
              background: "transparent", color: colors.purple, border: `1px solid ${colors.purple}55`,
              padding: "14px 30px", borderRadius: 4, fontFamily: "'JetBrains Mono',monospace",
              fontSize: 13, letterSpacing: "0.08em", cursor: "pointer",
              transition: "all 0.2s", textDecoration: "none", display: "inline-flex", alignItems: "center",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.purple}18`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
            LinkedIn ↗
          </a>
        </motion.div>

        {/* Scroll line */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          style={{ position: "absolute", bottom: -120, left: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 1, height: 60, background: `linear-gradient(to bottom, ${colors.cyan}, transparent)`, animation: "scrollLine 2s ease-in-out infinite" }} />
        </motion.div>
      </motion.div>

      {/* Floating code snippet */}
      <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 0.12, x: 0 }}
        transition={{ duration: 1, delay: 1.2 }} className="code-deco"
        style={{
          position: "absolute", right: "clamp(20px,8vw,120px)", top: "50%",
          transform: "translateY(-50%)", fontFamily: "'JetBrains Mono',monospace",
          fontSize: 12, color: colors.cyan, lineHeight: 2, pointerEvents: "none", display: "none",
        }}>
        {`const dev = {
  name: "Bikash Yadav",
  role: "Full Stack Dev",
  edu:  "MCA @ Krupanidhi",
  email: "yadavbikash179",
  github: "Monster-Here",
  status: "Building..."
}`}
      </motion.div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 12px #00d4ff}50%{opacity:.4;box-shadow:0 0 4px #00d4ff} }
        @keyframes scrollLine { 0%,100%{opacity:1;transform:scaleY(1)}50%{opacity:.3;transform:scaleY(.5)} }
        @media (min-width:900px) { .code-deco { display:block !important; } }
      `}</style>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const stats = [
    { label: "Projects Built", value: "4+" },
    { label: "Technologies", value: "10+" },
    { label: "Years Coding", value: "3+" },
  ];

  return (
    <section id="about" ref={ref} style={{ padding: "120px clamp(20px,8vw,120px)", position: "relative" }}>
      <GlowOrb x="90%" y="50%" color={colors.purple} size={500} opacity={0.05} />
      <motion.div variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeUp}>
          <SectionLabel>// 01 — About</SectionLabel>
          <SectionTitle>The Developer<br /><span style={{ color: colors.cyan }}>Behind the Code</span></SectionTitle>
        </motion.div>

        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
          <motion.div variants={fadeUp}>
            <p style={{ fontSize: 17, color: colors.textDim, lineHeight: 1.85, marginBottom: 24, fontFamily: "'DM Sans',sans-serif" }}>
              I'm a passionate full-stack developer currently pursuing my{" "}
              <span style={{ color: colors.purple, fontWeight: 600 }}>MCA at Krupanidhi College of Management</span>, Bengaluru — while building real-world applications using{" "}
              <span style={{ color: colors.cyan, fontWeight: 600 }}>React</span>,{" "}
              <span style={{ color: colors.cyan, fontWeight: 600 }}>Flask</span>, and{" "}
              <span style={{ color: colors.cyan, fontWeight: 600 }}>PostgreSQL</span>.
            </p>
            <p style={{ fontSize: 17, color: colors.textDim, lineHeight: 1.85, marginBottom: 24, fontFamily: "'DM Sans',sans-serif" }}>
              My focus is on <span style={{ color: colors.text }}>backend logic</span>,{" "}
              <span style={{ color: colors.text }}>authentication systems</span>, and{" "}
              <span style={{ color: colors.text }}>API development</span> — building the architecture that makes applications reliable and secure.
            </p>
            <p style={{ fontSize: 17, color: colors.textDim, lineHeight: 1.85, fontFamily: "'DM Sans',sans-serif" }}>
              My goal is to build <span style={{ color: colors.cyan }}>impactful, production-ready projects</span> that solve real problems for real users.
            </p>

            {/* Quick links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 32 }}>
              {[
                { icon: "✉", label: CONTACT.email, href: `mailto:${CONTACT.email}`, color: colors.cyan },
                { icon: "◈", label: CONTACT.githubHandle, href: CONTACT.github, color: colors.green },
                { icon: "◉", label: "bikash-y-832048130", href: CONTACT.linkedin, color: colors.purple },
                { icon: "◎", label: "Bengaluru, Karnataka, India", href: null, color: colors.gold },
              ].map((item) => {
                const Tag = item.href ? "a" : "div";
                return (
                  <Tag key={item.label} href={item.href} target={item.href ? "_blank" : undefined}
                    rel={item.href ? "noopener noreferrer" : undefined}
                    style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", transition: "opacity 0.2s" }}
                    onMouseEnter={item.href ? (e) => { e.currentTarget.style.opacity = "0.75"; } : undefined}
                    onMouseLeave={item.href ? (e) => { e.currentTarget.style.opacity = "1"; } : undefined}>
                    <span style={{ color: item.color, fontSize: 14, width: 20, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: colors.textMuted }}>{item.label}</span>
                  </Tag>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
              {stats.map((s) => (
                <div key={s.label} style={{
                  background: colors.surface, border: `1px solid ${colors.border}`,
                  borderRadius: 8, padding: "24px 16px", textAlign: "center",
                }}>
                  <div style={{ fontFamily: "'Syne',serif", fontSize: 36, fontWeight: 800, color: colors.cyan, letterSpacing: "-0.02em" }}>{s.value}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: colors.textMuted, letterSpacing: "0.1em", marginTop: 6, textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {["API Design", "Auth Systems", "Database Schema", "React UI", "Clean Code", "Problem Solving", "System Design", "Agile"].map((tag) => (
                <span key={tag} style={{
                  background: colors.cyanDim, border: `1px solid ${colors.cyanMid}`,
                  color: colors.cyan, padding: "6px 14px", borderRadius: 100,
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: "0.05em",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
      <style>{`@media (max-width:768px){.about-grid{grid-template-columns:1fr !important}}`}</style>
    </section>
  );
}

// ─── EDUCATION ────────────────────────────────────────────────────────────────
function Education() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="education" ref={ref} style={{
      padding: "120px clamp(20px,8vw,120px)", position: "relative",
      background: `linear-gradient(to bottom, transparent, ${colors.surface}33, transparent)`,
    }}>
      <GlowOrb x="15%" y="60%" color={colors.purple} size={500} opacity={0.05} />
      <motion.div variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeUp}>
          <SectionLabel>// 02 — Education</SectionLabel>
          <SectionTitle>Academic<br /><span style={{ color: colors.cyan }}>Journey</span></SectionTitle>
        </motion.div>

        <div style={{ position: "relative" }}>
          {/* Timeline vertical line */}
          <div style={{
            position: "absolute", left: 27, top: 0, bottom: 0, width: 1,
            background: `linear-gradient(to bottom, ${colors.cyan}, ${colors.purple}, transparent)`,
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {EDUCATION.map((edu, i) => (
              <motion.div key={edu.institution} variants={fadeUp} custom={i}>
                <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
                  {/* Dot icon */}
                  <div style={{ flexShrink: 0, position: "relative", zIndex: 1 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 12,
                      background: `${edu.color}18`, border: `1px solid ${edu.color}44`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, color: edu.color,
                    }}>
                      {edu.icon}
                    </div>
                  </div>

                  {/* Card */}
                  <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} style={{
                    flex: 1, background: colors.surface, border: `1px solid ${colors.border}`,
                    borderRadius: 14, padding: 32, position: "relative", overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 2,
                      background: `linear-gradient(to right, ${edu.color}, transparent)`,
                    }} />

                    <div className="edu-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <span style={{
                          display: "inline-flex", fontFamily: "'JetBrains Mono',monospace",
                          fontSize: 10, letterSpacing: "0.12em",
                          color: edu.status === "current" ? colors.green : colors.textMuted,
                          background: edu.status === "current" ? `${colors.green}18` : `${colors.textMuted}18`,
                          border: `1px solid ${edu.status === "current" ? `${colors.green}44` : `${colors.textMuted}33`}`,
                          padding: "4px 10px", borderRadius: 100, textTransform: "uppercase", marginBottom: 14,
                        }}>
                          {edu.status === "current" ? "● Currently Enrolled" : "✓ Completed"}
                        </span>

                        <h3 style={{ fontFamily: "'Syne',serif", fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 6, letterSpacing: "-0.01em" }}>
                          {edu.degree}
                        </h3>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: edu.color, fontWeight: 600, marginBottom: 4 }}>
                          {edu.institution}
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: colors.textMuted, marginBottom: 20 }}>
                          {edu.location} &nbsp;·&nbsp; {edu.period}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {edu.highlights.map((h, hi) => (
                            <div key={hi} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                              <div style={{ width: 5, height: 5, borderRadius: "50%", background: edu.color, marginTop: 7, flexShrink: 0 }} />
                              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: colors.textDim, lineHeight: 1.6 }}>
                                {h}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Degree badge */}
                      <div style={{
                        background: `${edu.color}12`, border: `1px solid ${edu.color}33`,
                        borderRadius: 10, padding: "16px 20px", textAlign: "center", minWidth: 90,
                      }}>
                        <div style={{ fontFamily: "'Syne',serif", fontSize: 22, fontWeight: 800, color: edu.color }}>
                          {edu.short}
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: colors.textMuted, letterSpacing: "0.08em", marginTop: 4 }}>
                          {edu.sub}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── SKILLS ──────────────────────────────────────────────────────────────────
function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" ref={ref} style={{ padding: "120px clamp(20px,8vw,120px)", position: "relative" }}>
      <motion.div variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeUp}>
          <SectionLabel>// 03 — Skills</SectionLabel>
          <SectionTitle>My Tech<br /><span style={{ color: colors.cyan }}>Arsenal</span></SectionTitle>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
          {SKILLS.map((skill, i) => (
            <motion.div key={skill.category} variants={fadeUp} custom={i}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              style={{
                background: colors.surface, border: `1px solid ${colors.border}`,
                borderRadius: 12, padding: 32, position: "relative", overflow: "hidden",
              }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: skill.color, borderRadius: "12px 12px 0 0" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 24, color: skill.color }}>{skill.icon}</span>
                <h3 style={{ fontFamily: "'Syne',serif", fontSize: 18, fontWeight: 700, color: colors.text, margin: 0 }}>{skill.category}</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {skill.items.map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: skill.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: colors.textDim }}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Currently Learning */}
        <motion.div variants={fadeUp} custom={4} style={{
          marginTop: 24, background: `${colors.gold}0f`, border: `1px solid ${colors.gold}33`,
          borderRadius: 12, padding: "20px 28px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: colors.gold, letterSpacing: "0.12em" }}>
            CURRENTLY EXPLORING →
          </span>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {["TypeScript", "Docker", "Redis", "Next.js"].map((tech) => (
              <span key={tech} style={{
                background: `${colors.gold}18`, border: `1px solid ${colors.gold}33`,
                color: colors.gold, padding: "4px 12px", borderRadius: 100,
                fontFamily: "'JetBrains Mono',monospace", fontSize: 12,
              }}>
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function ProjectCard({ project, i }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div variants={fadeUp} custom={i}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: colors.surface,
        border: `1px solid ${hovered ? project.highlight + "55" : colors.border}`,
        borderRadius: 12, padding: 32, display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden",
        transition: "border-color 0.3s, transform 0.2s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        opacity: project.status === "soon" ? 0.85 : 1,
      }}>
      <motion.div animate={{ scaleX: hovered ? 1 : 0 }} initial={{ scaleX: 0 }}
        transition={{ duration: 0.3 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: project.highlight, transformOrigin: "left" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <span style={{
          fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.15em",
          color: project.status === "soon" ? colors.gold : colors.green,
          background: project.status === "soon" ? `${colors.gold}18` : `${colors.green}18`,
          border: `1px solid ${project.status === "soon" ? `${colors.gold}44` : `${colors.green}44`}`,
          padding: "4px 10px", borderRadius: 100, textTransform: "uppercase",
        }}>
          {project.status === "soon" ? "Coming Soon" : "Live"}
        </span>
        <span style={{ fontSize: 20, color: project.highlight }}>◈</span>
      </div>

      <h3 style={{ fontFamily: "'Syne',serif", fontSize: 22, fontWeight: 700, color: colors.text, marginBottom: 12, letterSpacing: "-0.01em" }}>
        {project.title}
      </h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: colors.textDim, lineHeight: 1.75, flex: 1, marginBottom: 24 }}>
        {project.description}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {project.tech.map((t) => (
          <span key={t} style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: colors.textMuted,
            background: colors.surfaceHigh, border: `1px solid ${colors.border}`,
            padding: "4px 10px", borderRadius: 4, letterSpacing: "0.05em",
          }}>
            {t}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              padding: "10px", borderRadius: 6, background: "transparent",
              border: `1px solid ${colors.border}`, color: colors.textDim,
              fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: "0.05em",
              textDecoration: "none", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.textDim; e.currentTarget.style.color = colors.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textDim; }}>
            ⌥ GitHub
          </a>
        )}
        {project.demo ? (
          <a href={project.demo} target="_blank" rel="noopener noreferrer"
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              padding: "10px", borderRadius: 6, background: project.highlight, border: "none",
              color: colors.bg, fontFamily: "'JetBrains Mono',monospace", fontSize: 12,
              fontWeight: 700, letterSpacing: "0.05em", textDecoration: "none", transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
            ↗ Live Demo
          </a>
        ) : (
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "10px", borderRadius: 6, background: `${colors.gold}18`,
            border: `1px solid ${colors.gold}33`, color: colors.gold,
            fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: "0.05em",
          }}>
            In Progress...
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id="projects" ref={ref} style={{
      padding: "120px clamp(20px,8vw,120px)", position: "relative",
      background: `linear-gradient(to bottom, transparent, ${colors.surface}22, transparent)`,
    }}>
      <GlowOrb x="20%" y="50%" color={colors.cyan} size={500} opacity={0.05} />
      <motion.div variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeUp}>
          <SectionLabel>// 04 — Projects</SectionLabel>
          <SectionTitle>Things I've<br /><span style={{ color: colors.cyan }}>Built</span></SectionTitle>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: colors.textMuted, marginBottom: 60 }}>
            Real-world projects with full stack architecture
          </p>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24 }}>
          {PROJECTS.map((project, i) => <ProjectCard key={project.id} project={project} i={i} />)}
        </div>
      </motion.div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const handleSubmit = () => { if (form.name && form.email && form.message) setSent(true); };

  const links = [
    { label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, icon: "✉", color: colors.cyan },
    { label: "GitHub", value: CONTACT.githubHandle, href: CONTACT.github, icon: "◈", color: colors.green },
    { label: "LinkedIn", value: "bikash-y-832048130", href: CONTACT.linkedin, icon: "◉", color: colors.purple },
    { label: "Location", value: "Bengaluru, Karnataka, India", href: null, icon: "◎", color: colors.gold },
  ];

  return (
    <section id="contact" ref={ref} style={{ padding: "120px clamp(20px,8vw,120px)", position: "relative" }}>
      <GlowOrb x="80%" y="40%" color={colors.cyan} size={400} opacity={0.06} />
      <motion.div variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"}>
        <motion.div variants={fadeUp}>
          <SectionLabel>// 05 — Contact</SectionLabel>
          <SectionTitle>Let's Build<br /><span style={{ color: colors.cyan }}>Something</span></SectionTitle>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: colors.textMuted, marginBottom: 60, maxWidth: 480 }}>
            I'm open to collaboration, freelance projects, and full-time opportunities. Let's connect.
          </p>
        </motion.div>

        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 60 }}>
          <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {links.map((link) => {
              const Tag = link.href ? "a" : "div";
              return (
                <Tag key={link.label} href={link.href} target={link.href ? "_blank" : undefined}
                  rel={link.href ? "noopener noreferrer" : undefined}
                  style={{
                    display: "flex", alignItems: "center", gap: 16, padding: "18px 22px",
                    background: colors.surface, border: `1px solid ${colors.border}`,
                    borderRadius: 10, textDecoration: "none", transition: "all 0.2s",
                  }}
                  onMouseEnter={link.href ? (e) => {
                    e.currentTarget.style.borderColor = link.color + "55";
                    e.currentTarget.style.transform = "translateX(4px)";
                  } : undefined}
                  onMouseLeave={link.href ? (e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.transform = "translateX(0)";
                  } : undefined}>
                  <span style={{ fontSize: 18, color: link.color }}>{link.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: colors.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>
                      {link.label}
                    </div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: colors.textDim }}>{link.value}</div>
                  </div>
                  {link.href && <span style={{ marginLeft: "auto", color: colors.textMuted }}>→</span>}
                </Tag>
              );
            })}
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: colors.surface, border: `1px solid ${colors.green}44`,
                    borderRadius: 12, padding: 48, textAlign: "center", minHeight: 300,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
                  }}>
                  <div style={{ fontSize: 40, color: colors.green }}>✓</div>
                  <h3 style={{ fontFamily: "'Syne',serif", fontSize: 24, color: colors.green, margin: 0 }}>Message Sent!</h3>
                  <p style={{ color: colors.textMuted, fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>
                    I'll reply to you at {CONTACT.email}
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} style={{
                  background: colors.surface, border: `1px solid ${colors.border}`,
                  borderRadius: 12, padding: 36, display: "flex", flexDirection: "column", gap: 20,
                }}>
                  {[
                    { key: "name", label: "Name", type: "text", placeholder: "Your name" },
                    { key: "email", label: "Email", type: "email", placeholder: "your@email.com" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: colors.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                        {field.label}
                      </label>
                      <input required type={field.type} placeholder={field.placeholder} value={form[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        style={{
                          width: "100%", background: colors.bg, border: `1px solid ${colors.border}`,
                          borderRadius: 6, padding: "12px 16px", color: colors.text,
                          fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none",
                          boxSizing: "border-box", transition: "border-color 0.2s",
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = colors.cyan + "88"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = colors.border; }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: colors.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                      Message
                    </label>
                    <textarea required placeholder="Tell me about your project or opportunity..." rows={5}
                      value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{
                        width: "100%", background: colors.bg, border: `1px solid ${colors.border}`,
                        borderRadius: 6, padding: "12px 16px", color: colors.text,
                        fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none",
                        resize: "vertical", boxSizing: "border-box", transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = colors.cyan + "88"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = colors.border; }} />
                  </div>
                  <button type="submit" style={{
                    background: colors.cyan, color: colors.bg, border: "none",
                    padding: "14px 28px", borderRadius: 6, fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer",
                    transition: "all 0.2s", boxShadow: `0 0 20px ${colors.cyanMid}`,
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    Send Message →
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
      <style>{`@media (max-width:768px){.contact-grid{grid-template-columns:1fr !important}}`}</style>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${colors.border}`,
      padding: "32px clamp(20px,8vw,120px)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexWrap: "wrap", gap: 16,
    }}>
      <div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: colors.textMuted, letterSpacing: "0.05em" }}>
          © {new Date().getFullYear()} Bikash Yadav — All rights reserved
        </span>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: colors.textMuted, opacity: 0.5, marginTop: 4 }}>
          MCA Student · Krupanidhi College of Management, Bengaluru
        </div>
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        {[
          { label: "GitHub", href: CONTACT.github },
          { label: "LinkedIn", href: CONTACT.linkedin },
          { label: "Email", href: `mailto:${CONTACT.email}` },
        ].map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: colors.textMuted,
              textDecoration: "none", letterSpacing: "0.05em", transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = colors.cyan; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = colors.textMuted; }}>
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#080c14;color:#e2e8f0;min-height:100vh;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#080c14}
        ::-webkit-scrollbar-thumb{background:#1e2d45;border-radius:2px}
        ::selection{background:#00d4ff33;color:#00d4ff}
      `}</style>
      <div style={{ background: colors.bg, minHeight: "100vh", position: "relative" }}>
        <ScrollProgressBar />
        <GridNoise />
        <Navbar />
        <main style={{ position: "relative", zIndex: 1 }}>
          <Hero />
          <About />
          <Education />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}