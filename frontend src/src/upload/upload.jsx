import { toast } from "react-toastify";
import { useContext, useState, useRef } from "react";
import { usercontext } from "../appcontext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageLoader from "../components/PageLoader";
import styles from "./upload.module.css";

function Uploadpage() {
  const { serviceURL } = useContext(usercontext);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const inputRef = useRef(null);

  const validateFile = (f) => {
    if (!["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(f.type)) {
      toast.error("Only PDF or DOC/DOCX files are allowed");
      return false;
    }
    if (f.size > 2 * 1024 * 1024) {
      toast.error("File must be under 2MB");
      return false;
    }
    return true;
  };

  const handleFile = (f) => {
    if (f && validateFile(f)) setFile(f);
  };

  const onInputChange = (e) => {
    const f = e.target.files[0];
    if (f) handleFile(f);
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const truncateName = (name) => {
    if (name.length <= 28) return name;
    return name.substring(0, 12) + "..." + name.substring(name.length - 8);
  };

  const analyse = (e) => {
    e.preventDefault();
    if (!role.trim()) { toast.warn("Please enter a target role"); return; }
    if (!file) { toast.warn("Please upload your resume"); return; }

    const formdata = new FormData();
    formdata.append("roles", role.trim());
    formdata.append("file", file);

    setIsAnalysing(true);
    fetch(`${serviceURL}/extract`, { method: "post", body: formdata, credentials: "include" })
      .then((r) => {
        if (r.ok) {
          setFile(null); setRole("");
          navigate("/analysereport");
        } else {
          toast.error("Irrelevant resume or role — please try again");
        }
      })
      .catch(() => toast.error("Network error"))
      .finally(() => setIsAnalysing(false));
  };

  return (
    <div className={styles.page}>
      <Navbar showHome />
      {isAnalysing && <PageLoader text="Analysing Resume" />}

      <div className={styles.bgGlow} />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Upload Your Resume</h1>
          <p className={styles.pageSubtitle}>Get instant AI-powered analysis and feedback</p>
        </div>

        <div className={styles.grid}>
          {/* Upload Card */}
          <div className={styles.card}>
            <form onSubmit={analyse}>
              <div className={styles.section}>
                <label className={styles.sectionLabel}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Target Role
                </label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Software Engineer, Data Scientist..."
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className={styles.section}>
                <label className={styles.sectionLabel}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>
                  </svg>
                  Resume File
                </label>

                <div
                  className={`${styles.dropZone} ${isDragging ? styles.dropZoneDrag : ""} ${file ? styles.dropZoneFilled : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  onClick={() => inputRef.current?.click()}
                >
                  {file ? (
                    <div className={styles.fileInfo}>
                      <div className={styles.fileIcon}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="url(#fi)" strokeWidth="1.5">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/>
                          <defs><linearGradient id="fi" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#2563eb"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs>
                        </svg>
                      </div>
                      <div>
                        <p className={styles.fileName}>{truncateName(file.name)}</p>
                        <p className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button
                        type="button"
                        className={styles.removeFile}
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className={styles.dropContent}>
                      <div className={styles.uploadIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                        </svg>
                      </div>
                      <p className={styles.dropText}>Drag & drop your resume here</p>
                      <p className={styles.dropOr}>or</p>
                      <span className={styles.browseBtn}>Browse Files</span>
                      <p className={styles.dropHint}>PDF, DOC, DOCX · Max 2MB</p>
                    </div>
                  )}
                </div>
                <input ref={inputRef} type="file" hidden accept=".pdf,.doc,.docx" onChange={onInputChange} />
              </div>

              <button type="submit" className={styles.analyseBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Analyse Resume
              </button>
            </form>
          </div>

          {/* Guidelines */}
          <div className={styles.sidebar}>
            <div className={styles.guidelinesCard}>
              <h3 className={styles.guidelinesTitle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                Guidelines
              </h3>
              <ul className={styles.guidelinesList}>
                {[
                  { icon: "📄", title: "File Format", desc: "Upload PDF or DOC/DOCX files only." },
                  { icon: "⚖️", title: "File Size", desc: "Keep your file under 2 MB." },
                  { icon: "🌐", title: "Language", desc: "Resume must be in English." },
                  { icon: "🎯", title: "Role Input", desc: "Be specific with the job title for better analysis." },
                ].map(({ icon, title, desc }) => (
                  <li key={title} className={styles.guidelineItem}>
                    <span className={styles.guidelineEmoji}>{icon}</span>
                    <div>
                      <p className={styles.guidelineTitle}>{title}</p>
                      <p className={styles.guidelineDesc}>{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.tipCard}>
              <p className={styles.tipText}>
                💡 <strong>Pro tip:</strong> Use a clean, ATS-friendly resume format for the most accurate analysis results.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Uploadpage;