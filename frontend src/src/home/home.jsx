import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { usercontext } from "../appcontext";
import Navbar from "../components/Navbar";
import styles from "./home.module.css";

function Home() {
  const navigate = useNavigate();
  const { islogged, isprevious } = useContext(usercontext);

  const handleAnalyse = () => {
    navigate(islogged ? "/uploaddoc" : "/login");
  };

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Background effects */}
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />
      <div className={styles.bgGrid} />

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            AI-Powered Resume Intelligence
          </div>

          <h1 className={styles.heroTitle}>
            Analyse Your Resume
            <span className={styles.heroTitleGrad}> Like Never Before</span>
          </h1>

          <p className={styles.heroDesc}>
            Upload your resume and get instant, actionable insights — ATS
            compatibility score, keyword optimization, skill gap analysis, and
            formatting feedback to land your dream role.
          </p>

          <div className={styles.ctaRow}>
            <button className={styles.ctaPrimary} onClick={handleAnalyse}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{ position: "relative", zIndex: 1 }}
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              <span>Analyse Resume</span>
            </button>
            {isprevious && (
              <button
                className={styles.ctaSecondary}
                onClick={() => navigate("/analysereport")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10,9 9,9 8,9" />
                </svg>
                View Previous Report
              </button>
            )}
          </div>

          <div className={styles.statsRow}>
            {[
              { val: "ATS", label: "Score Check" },
              { val: "AI", label: "Skill Analysis" },
              { val: "PDF", label: "Doc Support" },
            ].map(({ val, label }) => (
              <div key={label} className={styles.statCard}>
                <span className={styles.statVal}>{val}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.visualCard}>
            <div className={styles.visualHeader}>
              <div className={styles.visualDots}>
                <span style={{ background: "#ef4444" }} />
                <span style={{ background: "#f59e0b" }} />
                <span style={{ background: "#22c55e" }} />
              </div>
              <span className={styles.visualTitle}>Resume Analysis</span>
            </div>
            <div className={styles.visualBody}>
              <ScoreRing score={82} />
              <div className={styles.visualMetrics}>
                {[
                  { label: "Keywords", val: 88, color: "#1e3a8a" },
                  { label: "Formatting", val: 75, color: "#1d4ed8" },
                  { label: "Skills Match", val: 91, color: "#2563eb" },
                ].map(({ label, val, color }) => (
                  <div key={label} className={styles.metricItem}>
                    <div className={styles.metricTop}>
                      <span className={styles.metricLabel}>{label}</span>
                      <span className={styles.metricVal} style={{ color }}>
                        {val}%
                      </span>
                    </div>
                    <div className={styles.metricBar}>
                      <div
                        className={styles.metricFill}
                        style={{ width: `${val}%`, background: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className={styles.features}>
        <div className={styles.featuresInner}>
          <h2 className={styles.featuresTitle}>
            Everything you need to stand out
          </h2>
          <p className={styles.featuresSubtitle}>
            Powerful tools designed to give your resume the competitive edge it
            deserves.
          </p>
          <div className={styles.featureGrid}>
            {[
              {
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                ),
                title: "Instant Analysis",
                desc: "Get comprehensive feedback in seconds, not hours. Our AI processes your resume instantly.",
              },
              {
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                ),
                title: "ATS Optimization",
                desc: "Ensure your resume passes automated screening systems used by top companies.",
              },
              {
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                ),
                title: "Skill Gap Detection",
                desc: "Discover missing skills relevant to your target role and industry demands.",
              },
              {
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                ),
                title: "Detailed Scoring",
                desc: "Quantified scores across multiple resume dimensions with actionable tips.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{icon}</div>
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>
          © {new Date().getFullYear()} Resume Analyser. Built for job seekers
          who aim higher.
        </p>
      </footer>
    </div>
  );
}

function ScoreRing({ score }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#navyGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
        <defs>
          <linearGradient id="navyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#1e3a8a" />
            <stop offset="1" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <text
          x="60"
          y="56"
          textAnchor="middle"
          fontSize="22"
          fontWeight="900"
          fill="#0f172a"
        >
          {score}
        </text>
        <text
          x="60"
          y="70"
          textAnchor="middle"
          fontSize="8"
          fill="#94a3b8"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          ATS SCORE
        </text>
      </svg>
    </div>
  );
}

export default Home;