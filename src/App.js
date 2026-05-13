import { useState, useEffect, useRef } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────
const FAIRWORK = {
  Zomato: 6, Swiggy: 6, Blinkit: 5, Zepto: 5,
  "Urban Company": 7, "Amazon Flex": 5, Ola: 3, Uber: 4, Other: 5
};
const MIN_WAGE = { Metro: 18000, "Tier-2": 14000, "Tier-3": 10000 };
const CITY_TIERS = {
  Mumbai: "Metro", Delhi: "Metro", Bengaluru: "Metro", Pune: "Metro",
  Hyderabad: "Metro", Chennai: "Metro", Kolkata: "Metro",
  Ahmedabad: "Tier-2", Jaipur: "Tier-2", Lucknow: "Tier-2",
  Nagpur: "Tier-2", Indore: "Tier-2", Nashik: "Tier-2",
  Vadodara: "Tier-2", Coimbatore: "Tier-2"
};
const CITIES = ["Mumbai","Delhi","Bengaluru","Pune","Hyderabad","Chennai","Kolkata","Ahmedabad","Jaipur","Lucknow","Nagpur","Indore","Nashik","Vadodara","Coimbatore","Other"];
const PLATFORMS = ["Zomato","Swiggy","Ola","Uber","Urban Company","Amazon Flex","Blinkit","Zepto","Other"];

const DASHBOARD_DATA = {
  platforms: [
    { name: "Ola", actual: 46.5, projected: 60 },
    { name: "Swiggy", actual: 48.1, projected: 60 },
    { name: "Uber", actual: 48.4, projected: 60 },
    { name: "Zepto", actual: 49.4, projected: 60 },
    { name: "Urban Co.", actual: 49.8, projected: 60 },
    { name: "Blinkit", actual: 49.9, projected: 60 },
    { name: "Zomato", actual: 50.4, projected: 60 },
    { name: "Amazon Flex", actual: 51.2, projected: 60 },
  ],
  risk: { crisis: 45, vulnerable: 250, stable: 205 },
  cities: [
    { name: "Mumbai", score: 47.2 }, { name: "Delhi", score: 49.1 },
    { name: "Bengaluru", score: 50.3 }, { name: "Chennai", score: 48.8 },
    { name: "Pune", score: 51.1 }, { name: "Hyderabad", score: 49.5 },
    { name: "Kolkata", score: 46.9 }, { name: "Ahmedabad", score: 50.8 },
  ],
  trend: [42, 44, 46, 47, 48, 49.1, 49.5, 50, 49.8, 49.1]
};

// ─── SCORING ─────────────────────────────────────────────────────────────────
function getScore(data) {
  const tier = CITY_TIERS[data.city] || "Tier-3";
  const minWage = MIN_WAGE[tier];
  const e = Number(data.earnings), exp = Number(data.expenses), sav = Number(data.savings);
  const incomeScore = Math.min((e / minWage) * 25, 25);
  const expenseScore = Math.max(0, (1 - exp / e) * 20);
  const benefitsScore = (data.insurance === "Yes" ? 10 : 0) + (data.hasSavings === "Yes" ? 10 : 0);
  const surplus = e - exp;
  const months = surplus > 0 ? sav / surplus : 0;
  const resilienceScore = Math.min((months / 3) * 20, 20);
  const platformScore = ((FAIRWORK[data.platform] || 5) / 10) * 15;
  const total = incomeScore + expenseScore + benefitsScore + resilienceScore + platformScore;
  return {
    total: Math.round(total * 10) / 10,
    incomeScore: Math.round(incomeScore * 10) / 10,
    expenseScore: Math.round(expenseScore * 10) / 10,
    benefitsScore,
    resilienceScore: Math.round(resilienceScore * 10) / 10,
    platformScore: Math.round(platformScore * 10) / 10,
    tier
  };
}

function getStatus(score) {
  if (score < 30) return { label: "Critical Risk", color: "#c0392b", bg: "#fdf2f0" };
  if (score < 50) return { label: "Vulnerable", color: "#e67e22", bg: "#fef9f0" };
  if (score < 70) return { label: "Moderate", color: "#2980b9", bg: "#f0f7fd" };
  return { label: "Stable", color: "#27ae60", bg: "#f0fdf4" };
}

// ─── TRAIL CURSOR ─────────────────────────────────────────────────────────────
function TrailCursor() {
  const trailRef = useRef([]);
  const [dots, setDots] = useState([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef();

  useEffect(() => {
    const handleMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      const now = Date.now();
      trailRef.current.push({ x: e.clientX, y: e.clientY, t: now });
      trailRef.current = trailRef.current.filter(d => now - d.t < 500);
    };
    window.addEventListener("mousemove", handleMove);
    const animate = () => {
      setDots([...trailRef.current]);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9999 }}>
      {dots.map((d, i) => {
        const age = (Date.now() - d.t) / 500;
        const size = (1 - age) * 8;
        const opacity = (1 - age) * 0.6;
        return (
          <div key={i} style={{
            position: "fixed", left: d.x - size / 2, top: d.y - size / 2,
            width: size, height: size, borderRadius: 2,
            background: `rgba(44, 90, 160, ${opacity})`,
            transform: `rotate(45deg)`,
            transition: "none"
          }} />
        );
      })}
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  app: { fontFamily: "'Georgia', 'Times New Roman', serif", background: "#f7f5f0", minHeight: "100vh", color: "#1a1a2e" },
  nav: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
    background: "rgba(247,245,240,0.95)", backdropFilter: "blur(12px)",
    borderBottom: "1px solid #e0ddd6", padding: "0 40px",
    display: "flex", alignItems: "center", justifyContent: "space-between", height: 64
  },
  logo: { fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: "bold", color: "#1a1a2e", letterSpacing: "-0.5px", cursor: "pointer" },
  navLinks: { display: "flex", gap: 8 },
  navBtn: (active) => ({
    padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer",
    fontFamily: "'Georgia', serif", fontSize: 14, fontWeight: active ? "bold" : "normal",
    background: active ? "#1a1a2e" : "transparent",
    color: active ? "#f7f5f0" : "#555",
    transition: "all 0.2s"
  }),
  hero: {
    minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", textAlign: "center",
    padding: "80px 40px 40px", background: "linear-gradient(160deg, #f7f5f0 0%, #eef0f8 100%)"
  },
  heroTag: {
    display: "inline-block", padding: "6px 14px", borderRadius: 20,
    background: "#1a1a2e", color: "#f7f5f0", fontSize: 12, letterSpacing: 2,
    textTransform: "uppercase", marginBottom: 24
  },
  h1: { fontSize: "clamp(40px, 6vw, 80px)", fontWeight: "bold", lineHeight: 1.1, marginBottom: 24, color: "#1a1a2e" },
  accent: { color: "#2c5aa0" },
  sub: { fontSize: 20, color: "#666", maxWidth: 560, lineHeight: 1.6, marginBottom: 40 },
  btnPrimary: {
    padding: "14px 32px", background: "#1a1a2e", color: "#f7f5f0",
    border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer",
    fontFamily: "'Georgia', serif", fontWeight: "bold",
    transition: "all 0.2s", boxShadow: "0 4px 20px rgba(26,26,46,0.15)"
  },
  btnSecondary: {
    padding: "14px 32px", background: "transparent", color: "#1a1a2e",
    border: "2px solid #1a1a2e", borderRadius: 8, fontSize: 16, cursor: "pointer",
    fontFamily: "'Georgia', serif", transition: "all 0.2s", marginLeft: 12
  },
  statsRow: { display: "flex", gap: 24, marginTop: 60, flexWrap: "wrap", justifyContent: "center" },
  statCard: {
    background: "white", borderRadius: 12, padding: "20px 32px", textAlign: "center",
    boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #e8e4de",
    transition: "all 0.3s", cursor: "default"
  },
  statNum: { fontSize: 36, fontWeight: "bold", color: "#1a1a2e" },
  statLabel: { fontSize: 13, color: "#888", marginTop: 4 },
  section: { maxWidth: 1100, margin: "0 auto", padding: "80px 40px" },
  sectionTitle: { fontSize: 36, fontWeight: "bold", marginBottom: 8, color: "#1a1a2e" },
  sectionSub: { fontSize: 16, color: "#888", marginBottom: 48 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 },
  featureCard: {
    background: "white", borderRadius: 12, padding: 32,
    border: "1px solid #e8e4de", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    transition: "all 0.3s", cursor: "default"
  },
  featureIcon: { fontSize: 32, marginBottom: 16 },
  featureTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#1a1a2e" },
  featureText: { fontSize: 15, color: "#666", lineHeight: 1.6 },
  page: { paddingTop: 64, minHeight: "100vh", background: "#f7f5f0" },
  pageHeader: { background: "#1a1a2e", color: "#f7f5f0", padding: "60px 40px" },
  pageTitle: { maxWidth: 1100, margin: "0 auto", fontSize: 42, fontWeight: "bold" },
  pageDesc: { maxWidth: 1100, margin: "8px auto 0", fontSize: 16, opacity: 0.7 },
  card: {
    background: "white", borderRadius: 12, padding: 28,
    border: "1px solid #e8e4de", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    marginBottom: 24, transition: "all 0.3s"
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#1a1a2e", marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "bold", color: "#555", marginBottom: 6, display: "block", letterSpacing: 0.5 },
  input: {
    width: "100%", padding: "12px 14px", borderRadius: 8, border: "1.5px solid #e0ddd6",
    fontSize: 15, fontFamily: "'Georgia', serif", color: "#1a1a2e",
    background: "#fafaf8", boxSizing: "border-box", marginBottom: 20,
    outline: "none", transition: "border-color 0.2s"
  },
  calcBtn: {
    width: "100%", padding: 16, background: "#1a1a2e", color: "#f7f5f0",
    border: "none", borderRadius: 8, fontSize: 17, cursor: "pointer",
    fontFamily: "'Georgia', serif", fontWeight: "bold",
    transition: "all 0.2s", boxShadow: "0 4px 20px rgba(26,26,46,0.2)"
  },
  scoreBox: (color, bg) => ({
    background: bg, border: `2px solid ${color}`, borderRadius: 16,
    padding: "40px 32px", textAlign: "center", marginBottom: 24
  }),
  scoreBig: (color) => ({ fontSize: 80, fontWeight: "bold", color, lineHeight: 1 }),
  scoreLabel: (color) => ({ fontSize: 20, color, marginTop: 8 }),
  barWrap: { marginBottom: 16 },
  barHeader: { display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 },
  barTrack: { background: "#f0ede8", borderRadius: 4, height: 10, position: "relative", overflow: "hidden" },
  barFill: (pct, color) => ({
    height: "100%", width: `${pct}%`, background: color, borderRadius: 4,
    transition: "width 0.8s ease"
  }),
  barShadow: (pct) => ({
    position: "absolute", top: 0, right: 0, height: "100%",
    width: `${100 - pct}%`, background: "rgba(0,0,0,0.05)",
    borderLeft: "2px dashed rgba(0,0,0,0.15)"
  }),
  divChart: { display: "flex", flexDirection: "column", gap: 12 },
  divRow: { display: "flex", alignItems: "center", gap: 12 },
  divName: { width: 90, fontSize: 13, color: "#555", textAlign: "right", flexShrink: 0 },
  divTrack: { flex: 1, height: 28, background: "#f0ede8", borderRadius: 4, position: "relative", overflow: "hidden" },
  trendLine: { padding: "20px 0" },
  aboutSection: { maxWidth: 800, margin: "0 auto", padding: "60px 40px" },
  aboutCard: {
    background: "white", borderRadius: 16, padding: 40,
    border: "1px solid #e8e4de", boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    marginBottom: 32
  },
  tag: {
    display: "inline-block", padding: "4px 12px", borderRadius: 20,
    background: "#1a1a2e", color: "#f7f5f0", fontSize: 11,
    letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16
  },
  reportBox: {
    background: "white", borderRadius: 16, padding: 40,
    border: "1px solid #e8e4de", maxWidth: 700, margin: "0 auto"
  }
};

// ─── MINI COMPONENTS ─────────────────────────────────────────────────────────
function ScoreBar({ label, score, max, color }) {
  const pct = (score / max) * 100;
  const projPct = 100;
  return (
    <div style={S.barWrap}>
      <div style={S.barHeader}>
        <span style={{ color: "#555" }}>{label}</span>
        <span style={{ fontWeight: "bold", color }}>{score}<span style={{ color: "#aaa", fontWeight: "normal" }}>/{max}</span></span>
      </div>
      <div style={S.barTrack}>
        <div style={S.barFill(pct, color)} />
        <div style={S.barShadow(pct)} />
      </div>
    </div>
  );
}

function DivergentBar({ name, actual, projected }) {
  const deviation = actual - projected;
  const maxDev = 20;
  const pct = Math.abs(deviation) / maxDev * 50;
  const isPositive = deviation >= 0;
  return (
    <div style={S.divRow}>
      <span style={S.divName}>{name}</span>
      <div style={S.divTrack}>
        <div style={{
          position: "absolute", left: "50%", top: 2, bottom: 2, width: 2,
          background: "#ccc", zIndex: 1
        }} />
        <div style={{
          position: "absolute",
          left: isPositive ? "50%" : `${50 - pct}%`,
          width: `${pct}%`,
          top: 0, bottom: 0,
          background: isPositive ? "rgba(39,174,96,0.7)" : "rgba(192,57,43,0.7)",
          borderRadius: isPositive ? "0 4px 4px 0" : "4px 0 0 4px"
        }} />
        <span style={{
          position: "absolute", top: "50%", transform: "translateY(-50%)",
          left: isPositive ? `calc(50% + ${pct}% + 4px)` : `calc(50% - ${pct}% - 40px)`,
          fontSize: 11, color: "#888", whiteSpace: "nowrap"
        }}>{actual}</span>
      </div>
      <span style={{ fontSize: 11, color: isPositive ? "#27ae60" : "#c0392b", width: 44, textAlign: "right" }}>
        {isPositive ? "+" : ""}{(deviation).toFixed(1)}
      </span>
    </div>
  );
}

function TrendChart({ data }) {
  const max = Math.max(...data), min = Math.min(...data) - 2;
  const w = 500, h = 120;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  });
  const pathD = `M ${pts.join(" L ")}`;
  const areaD = `M 0,${h} L ${pts.join(" L ")} L ${w},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 120 }}>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c5aa0" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2c5aa0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#grad)" />
      <path d={`M 0,${h * 0.4} L ${w},${h * 0.4}`} stroke="#e0ddd6" strokeDasharray="4,4" strokeWidth={1} />
      <path d={pathD} stroke="#2c5aa0" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / (max - min)) * h;
        return <circle key={i} cx={x} cy={y} r={4} fill="white" stroke="#2c5aa0" strokeWidth={2} />;
      })}
    </svg>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────
function Landing({ setPage }) {
  const [hovered, setHovered] = useState(null);
  const features = [
    { icon: "📊", title: "5-Dimension Scoring", text: "Income stability, expense burden, benefits gap, crisis resilience, and platform risk — all measured in one score." },
    { icon: "🏙️", title: "City-Aware Analysis", text: "Scores are calibrated against city-specific minimum wages across Metro, Tier-2, and Tier-3 cities." },
    { icon: "⚖️", title: "Fairwork Indexed", text: "Platform scores are weighted using real Fairwork India 2024 ratings for accuracy." },
    { icon: "📋", title: "Downloadable Reports", text: "Get a complete financial health report with breakdown, recommendations, and next steps." },
    { icon: "🔍", title: "Real Data Backed", text: "Built on PLFS, NITI Aayog, IFAT, and Fairwork India published research data." },
    { icon: "🆓", title: "Completely Free", text: "No cost, no login, no data stored. Your information stays with you." },
  ];
  return (
    <div>
      <div style={S.hero}>
        <div style={S.heroTag}>India's First Gig Worker Financial Audit Engine</div>
        <h1 style={S.h1}>Know Your <span style={S.accent}>Financial</span><br />Health Score</h1>
        <p style={S.sub}>GigLens analyses your income, expenses, savings, and platform risk to tell you exactly where you stand — and what to do about it.</p>
        <div>
          <button style={S.btnPrimary} onClick={() => setPage("calculator")}
            onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.target.style.transform = "none"}>
            Calculate My Score →
          </button>
          <button style={S.btnSecondary} onClick={() => setPage("dashboard")}
            onMouseEnter={e => { e.target.style.background = "#1a1a2e"; e.target.style.color = "#f7f5f0"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#1a1a2e"; }}>
            View Dashboard
          </button>
        </div>
        <div style={S.statsRow}>
          {[["500+", "Workers Analysed"], ["49.1", "Avg GigLens Score"], ["45", "In Critical Risk"], ["8", "Platforms Covered"]].map(([n, l]) => (
            <div key={l} style={{ ...S.statCard }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}>
              <div style={S.statNum}>{n}</div>
              <div style={S.statLabel}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "white", borderTop: "1px solid #e8e4de" }}>
        <div style={S.section}>
          <div style={S.sectionTitle}>What GigLens Measures</div>
          <p style={S.sectionSub}>Every dimension of your financial life, audited and scored.</p>
          <div style={S.grid3}>
            {features.map((f, i) => (
              <div key={i} style={{ ...S.featureCard, transform: hovered === i ? "translateY(-6px)" : "none", boxShadow: hovered === i ? "0 12px 32px rgba(0,0,0,0.1)" : "0 2px 12px rgba(0,0,0,0.04)" }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                <div style={S.featureIcon}>{f.icon}</div>
                <div style={S.featureTitle}>{f.title}</div>
                <div style={S.featureText}>{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 100); }, []);
  const { platforms, risk, cities, trend } = DASHBOARD_DATA;
  const total = risk.crisis + risk.vulnerable + risk.stable;

  return (
    <div style={S.page}>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}>India Gig Economy Dashboard</div>
        <div style={S.pageDesc}>Live financial health analysis of 500 platform workers across 15 cities</div>
      </div>
      <div style={S.section}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
          {[
            { label: "Average Score", value: "49.1", sub: "Out of 100", color: "#e67e22" },
            { label: "Critical Risk", value: risk.crisis, sub: `${((risk.crisis/total)*100).toFixed(0)}% of workers`, color: "#c0392b" },
            { label: "Vulnerable", value: risk.vulnerable, sub: `${((risk.vulnerable/total)*100).toFixed(0)}% of workers`, color: "#e67e22" },
            { label: "Stable", value: risk.stable, sub: `${((risk.stable/total)*100).toFixed(0)}% of workers`, color: "#27ae60" },
          ].map((m, i) => (
            <div key={i} style={{ ...S.card, borderLeft: `4px solid ${m.color}`, padding: "20px 24px" }}>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 36, fontWeight: "bold", color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 12, color: "#aaa" }}>{m.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          <div style={S.card}>
            <div style={S.cardTitle}>Platform Score vs Target (60)</div>
            <p style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>Red = below target · Green = above · Dashed line = projection</p>
            <div style={S.divChart}>
              {platforms.map((p, i) => (
                <DivergentBar key={i} name={p.name} actual={animated ? p.actual : 60} projected={p.projected} />
              ))}
            </div>
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>Score by Platform</div>
            <p style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>Solid bar = actual · Shaded area = gap to target</p>
            {platforms.map((p, i) => {
              const pct = animated ? (p.actual / p.projected) * 100 : 0;
              const color = p.actual < 48 ? "#c0392b" : p.actual < 52 ? "#e67e22" : "#27ae60";
              return (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span>{p.name}</span><span style={{ color }}>{p.actual}</span>
                  </div>
                  <div style={S.barTrack}>
                    <div style={S.barFill(pct, color)} />
                    <div style={S.barShadow(pct)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          <div style={S.card}>
            <div style={S.cardTitle}>Average Score Trend (10 months)</div>
            <p style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>Dashed line = projected baseline</p>
            <TrendChart data={trend} />
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>City Risk Map</div>
            {cities.map((c, i) => {
              const color = c.score < 48 ? "#c0392b" : c.score < 51 ? "#e67e22" : "#27ae60";
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f0ede8" }}>
                  <span style={{ fontSize: 13 }}>{c.name}</span>
                  <span style={{ fontSize: 14, fontWeight: "bold", color }}>{c.score}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Calculator({ savedResult, savedForm, setSavedResult, setSavedForm, setPage }) {
  const [form, setForm] = useState(savedForm || {
    name: "", platform: "Zomato", city: "Mumbai",
    earnings: "", expenses: "", insurance: "No", hasSavings: "No", savings: "0"
  });
  const [result, setResult] = useState(savedResult || null);
  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const calculate = () => {
    if (!form.earnings || !form.expenses) return alert("Please fill all required fields");
    const r = getScore(form);
    setResult(r);
    setSavedResult(r);
    setSavedForm(form);
  };
  const status = result ? getStatus(result.total) : null;

  return (
    <div style={S.page}>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}>GigLens Calculator</div>
        <div style={S.pageDesc}>Enter your details to receive your personalised financial health score</div>
      </div>
      <div style={{ ...S.section, maxWidth: 800 }}>
        <div style={S.card}>
          <div style={S.cardTitle}>Your Details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
            <div>
              <label style={S.label}>Full Name</label>
              <input style={S.input} value={form.name} onChange={e => handle("name", e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label style={S.label}>Platform</label>
              <select style={S.input} value={form.platform} onChange={e => handle("platform", e.target.value)}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>City</label>
              <select style={S.input} value={form.city} onChange={e => handle("city", e.target.value)}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>Monthly Earnings (₹)</label>
              <input style={S.input} type="number" value={form.earnings} onChange={e => handle("earnings", e.target.value)} placeholder="e.g. 18000" />
            </div>
            <div>
              <label style={S.label}>Monthly Expenses (₹)</label>
              <input style={S.input} type="number" value={form.expenses} onChange={e => handle("expenses", e.target.value)} placeholder="e.g. 12000" />
            </div>
            <div>
              <label style={S.label}>Health Insurance?</label>
              <select style={S.input} value={form.insurance} onChange={e => handle("insurance", e.target.value)}>
                <option>No</option><option>Yes</option>
              </select>
            </div>
            <div>
              <label style={S.label}>Do you have savings?</label>
              <select style={S.input} value={form.hasSavings} onChange={e => handle("hasSavings", e.target.value)}>
                <option>No</option><option>Yes</option>
              </select>
            </div>
            {form.hasSavings === "Yes" && (
              <div>
                <label style={S.label}>Savings Amount (₹)</label>
                <input style={S.input} type="number" value={form.savings} onChange={e => handle("savings", e.target.value)} placeholder="e.g. 10000" />
              </div>
            )}
          </div>
          <button style={S.calcBtn} onClick={calculate}
            onMouseEnter={e => e.target.style.background = "#2c5aa0"}
            onMouseLeave={e => e.target.style.background = "#1a1a2e"}>
            Calculate My GigLens Score →
          </button>
        </div>

        {result && status && (
          <div>
            <div style={S.scoreBox(status.color, status.bg)}>
              <div style={{ fontSize: 13, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>GigLens Score for {form.name || "You"}</div>
              <div style={S.scoreBig(status.color)}>{result.total}</div>
              <div style={S.scoreLabel(status.color)}>/100 — {status.label}</div>
              <div style={{ fontSize: 13, color: "#999", marginTop: 8 }}>City Tier: {result.tier} · Platform: {form.platform}</div>
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>Score Breakdown — Actual vs Maximum</div>
              <p style={{ fontSize: 12, color: "#aaa", marginBottom: 20 }}>Solid bar = your score · Shaded area = gap to maximum</p>
              {[
                ["Income Stability", result.incomeScore, 25, "#2c5aa0"],
                ["Expense Burden", result.expenseScore, 20, "#27ae60"],
                ["Benefits Gap", result.benefitsScore, 20, "#e67e22"],
                ["Crisis Resilience", result.resilienceScore, 20, "#8e44ad"],
                ["Platform Safety", result.platformScore, 15, "#16a085"],
              ].map(([name, score, max, color]) => (
                <ScoreBar key={name} label={name} score={score} max={max} color={color} />
              ))}
            </div>
            <div style={{ ...S.card, background: "#1a1a2e", color: "#f7f5f0" }}>
              <div style={{ ...S.cardTitle, color: "#f7f5f0" }}>Recommendations</div>
              {result.benefitsScore < 20 && <p style={{ color: "#bbb", marginBottom: 8 }}>⚠️ You are missing key benefits. Explore e-Shram portal for insurance registration.</p>}
              {result.resilienceScore < 10 && <p style={{ color: "#bbb", marginBottom: 8 }}>⚠️ Low crisis resilience. Try to build 3 months of expense buffer as emergency savings.</p>}
              {result.incomeScore < 15 && <p style={{ color: "#bbb", marginBottom: 8 }}>⚠️ Income below city minimum wage benchmark. Consider multi-platform work to increase earnings.</p>}
              {result.total >= 50 && <p style={{ color: "#4ade80", marginBottom: 8 }}>✓ Your score is above the national average of 49.1. Keep building your savings buffer.</p>}
              <button onClick={() => setPage("report")} style={{ ...S.calcBtn, background: "#2c5aa0", marginTop: 16 }}
                onMouseEnter={e => e.target.style.background = "#1a4a8a"}
                onMouseLeave={e => e.target.style.background = "#2c5aa0"}>
                View Full Report & Download →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Report({ setPage, savedResult, savedForm }) {
  const status = savedResult ? getStatus(savedResult.total) : null;

  const downloadReport = () => {
    const content = `
GIGLENS FINANCIAL HEALTH REPORT
================================
Name: ${savedForm?.name || "Worker"}
Platform: ${savedForm?.platform}
City: ${savedForm?.city}
City Tier: ${savedResult?.tier}
Date: ${new Date().toLocaleDateString()}

GIGLENS SCORE: ${savedResult?.total} / 100
Status: ${status?.label}

SCORE BREAKDOWN
---------------
Income Stability:   ${savedResult?.incomeScore} / 25
Expense Burden:     ${savedResult?.expenseScore} / 20
Benefits Gap:       ${savedResult?.benefitsScore} / 20
Crisis Resilience:  ${savedResult?.resilienceScore} / 20
Platform Safety:    ${savedResult?.platformScore} / 15

FINANCIAL SUMMARY
-----------------
Monthly Earnings:  ₹${savedForm?.earnings}
Monthly Expenses:  ₹${savedForm?.expenses}
Monthly Surplus:   ₹${Number(savedForm?.earnings) - Number(savedForm?.expenses)}
Health Insurance:  ${savedForm?.insurance}
Has Savings:       ${savedForm?.hasSavings}
${savedForm?.hasSavings === "Yes" ? `Savings Amount:    ₹${savedForm?.savings}` : ""}

RECOMMENDATIONS
---------------
${savedResult?.benefitsScore < 20 ? "⚠ You are missing key benefits. Explore e-Shram portal for insurance registration.\n" : ""}${savedResult?.resilienceScore < 10 ? "⚠ Low crisis resilience. Try to build 3 months of expense buffer.\n" : ""}${savedResult?.incomeScore < 15 ? "⚠ Income below city minimum wage. Consider multi-platform work.\n" : ""}${savedResult?.total >= 50 ? "✓ Your score is above the national average of 49.1.\n" : ""}

NATIONAL CONTEXT
----------------
National Average GigLens Score: 49.1 / 100
Workers in Crisis (<30):        45 / 500 (9%)
Workers Vulnerable (30-50):     250 / 500 (50%)
Workers Stable (>50):           205 / 500 (41%)

Generated by GigLens — India's Gig Worker Financial Audit Engine
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GigLens_Report_${savedForm?.name || "Worker"}_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={S.page}>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}>Download Report</div>
        <div style={S.pageDesc}>Your full GigLens financial health report</div>
      </div>
      <div style={{ ...S.section, maxWidth: 800 }}>
        {savedResult && status ? (
          <div style={S.reportBox}>
            <div style={S.tag}>Your Report</div>
            <h2 style={{ fontSize: 28, marginBottom: 4 }}>{savedForm?.name || "Worker"}'s GigLens Report</h2>
            <p style={{ color: "#888", marginBottom: 24 }}>{savedForm?.platform} · {savedForm?.city} · {new Date().toLocaleDateString()}</p>

            <div style={{ ...S.scoreBox(status.color, status.bg), marginBottom: 24 }}>
              <div style={S.scoreBig(status.color)}>{savedResult.total}</div>
              <div style={S.scoreLabel(status.color)}>/100 — {status.label}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {[
                ["Income Stability", `${savedResult.incomeScore}/25`],
                ["Expense Burden", `${savedResult.expenseScore}/20`],
                ["Benefits Gap", `${savedResult.benefitsScore}/20`],
                ["Crisis Resilience", `${savedResult.resilienceScore}/20`],
                ["Platform Safety", `${savedResult.platformScore}/15`],
                ["Monthly Surplus", `₹${Number(savedForm.earnings) - Number(savedForm.expenses)}`],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: "16px 20px", background: "#f7f5f0", borderRadius: 8, border: "1px solid #e8e4de" }}>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 20, fontWeight: "bold", color: "#1a1a2e" }}>{value}</div>
                </div>
              ))}
            </div>

            <button style={{ ...S.calcBtn, marginBottom: 12 }} onClick={downloadReport}
              onMouseEnter={e => e.target.style.background = "#2c5aa0"}
              onMouseLeave={e => e.target.style.background = "#1a1a2e"}>
              ↓ Download Full Report (.txt)
            </button>
            <button style={{ ...S.calcBtn, background: "transparent", color: "#1a1a2e", border: "2px solid #1a1a2e" }}
              onClick={() => setPage("calculator")}
              onMouseEnter={e => { e.target.style.background = "#1a1a2e"; e.target.style.color = "#f7f5f0"; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#1a1a2e"; }}>
              Recalculate Score
            </button>
          </div>
        ) : (
          <div style={S.reportBox}>
            <div style={S.tag}>Report Center</div>
            <h2 style={{ fontSize: 28, marginBottom: 8 }}>No Score Yet</h2>
            <p style={{ color: "#888", marginBottom: 32 }}>Calculate your GigLens score first to generate your personalised report.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {["Score Breakdown", "Platform Analysis", "City Benchmarks", "Recommendations", "Crisis Assessment", "Action Plan"].map((item) => (
                <div key={item} style={{ padding: "16px 20px", background: "#f7f5f0", borderRadius: 8, border: "1px solid #e8e4de", fontSize: 14 }}>
                  ✓ {item}
                </div>
              ))}
            </div>
            <button style={S.calcBtn} onClick={() => setPage("calculator")}
              onMouseEnter={e => e.target.style.background = "#2c5aa0"}
              onMouseLeave={e => e.target.style.background = "#1a1a2e"}>
              Calculate Score First →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function About() {
  return (
    <div style={S.page}>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}>About GigLens</div>
        <div style={S.pageDesc}>The problem, the mission, and the person behind it</div>
      </div>
      <div style={S.aboutSection}>
        <div style={S.aboutCard}>
          <div style={S.tag}>The Problem</div>
          <h2 style={{ fontSize: 26, marginBottom: 16 }}>23.5 million invisible workers</h2>
          <p style={{ color: "#666", lineHeight: 1.8, marginBottom: 16 }}>India's gig workers — the delivery partners, drivers, and service providers powering our daily lives — exist in a financial blind spot. They earn below minimum wage, have no insurance, no savings, and no institution tracking their financial vulnerability at scale.</p>
          <p style={{ color: "#666", lineHeight: 1.8 }}>The Fairwork India Report 2024 found that no platform fully meets basic fair work standards. The PLFS 2025 still has no dedicated gig worker classification. GigLens was built to fill that gap.</p>
        </div>
        <div style={S.aboutCard}>
          <div style={S.tag}>The Builder</div>
          <h2 style={{ fontSize: 26, marginBottom: 16 }}>Jessica Mathew</h2>
          <p style={{ color: "#666", lineHeight: 1.8, marginBottom: 16 }}>MBA Finance & Technology candidate at MIT ADT University, Pune. Certified Business Analyst (CBAP, CAP) with expertise in financial modeling, variance analysis, and data-driven business process design.</p>
          <p style={{ color: "#666", lineHeight: 1.8 }}>GigLens is a production-grade portfolio project combining SQL, Python, financial modeling, and business requirements analysis to solve a real public policy problem.</p>
        </div>
        <div style={S.aboutCard}>
          <div style={S.tag}>The Methodology</div>
          <h2 style={{ fontSize: 26, marginBottom: 16 }}>How Scores Are Calculated</h2>
          {[
            ["Income Stability (25%)", "Earnings vs city-specific minimum wage benchmark"],
            ["Expense Burden (20%)", "Monthly expenses as a percentage of gross earnings"],
            ["Benefits Gap (20%)", "Presence of health insurance and savings"],
            ["Crisis Resilience (20%)", "Months of expenses covered by current savings"],
            ["Platform Risk (15%)", "Weighted by Fairwork India 2024 platform scores"],
          ].map(([title, desc]) => (
            <div key={title} style={{ padding: "12px 0", borderBottom: "1px solid #f0ede8" }}>
              <div style={{ fontWeight: "bold", marginBottom: 4 }}>{title}</div>
              <div style={{ color: "#888", fontSize: 14 }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={S.aboutCard}>
          <div style={S.tag}>Data Sources</div>
          <h2 style={{ fontSize: 26, marginBottom: 16 }}>Built on Real Research</h2>
          {["PLFS Annual Reports (MoSPI)", "NITI Aayog Gig Economy Policy Brief 2022", "Fairwork India Reports 2022–2024", "IFAT Worker Survey Data", "Karnataka Gig Workers Bill 2023", "OpenBudgetsIndia.org"].map(s => (
            <div key={s} style={{ padding: "8px 0", borderBottom: "1px solid #f0ede8", fontSize: 14, color: "#555" }}>→ {s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [savedResult, setSavedResult] = useState(null);
  const [savedForm, setSavedForm] = useState(null);
  const pages = [
    { id: "home", label: "Home" },
    { id: "dashboard", label: "Dashboard" },
    { id: "calculator", label: "Calculator" },
    { id: "report", label: "Report" },
    { id: "about", label: "About" },
  ];

  return (
    <div style={S.app}>
      <TrailCursor />
      <nav style={S.nav}>
        <div style={S.logo} onClick={() => setPage("home")}>GigLens</div>
        <div style={S.navLinks}>
          {pages.map(p => (
            <button key={p.id} style={S.navBtn(page === p.id)} onClick={() => setPage(p.id)}>{p.label}</button>
          ))}
        </div>
      </nav>
      <div>
        {page === "home" && <Landing setPage={setPage} />}
        {page === "dashboard" && <Dashboard />}
        {page === "calculator" && <Calculator savedResult={savedResult} savedForm={savedForm} setSavedResult={setSavedResult} setSavedForm={setSavedForm} setPage={setPage} />}
        {page === "report" && <Report setPage={setPage} savedResult={savedResult} savedForm={savedForm} />}
        {page === "about" && <About />}
      </div>
    </div>
  );
}
