import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usercontext } from "../appcontext";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import styles from "./resetpassword.module.css";

function Forgotpassword() {
  const navigate = useNavigate();
  const { backendURL, islogged } = useContext(usercontext);

  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=newpass
  const [email, setemail] = useState("");
  const [otp, setotp] = useState(["", "", "", "", "", ""]);
  const [newpassword, setnewpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [isloading, setisloading] = useState(false);
  const [showpass, setshowpass] = useState(false);
  const [showconfirmpass, setshowconfirmpass] = useState(false);

  useEffect(() => { if (islogged) navigate("/"); }, [islogged]);

  function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

  const sendOtp = () => {
    if (!email.trim()) { toast.warn("Email required"); return; }
    if (!validateEmail(email.trim())) { toast.warn("Invalid email"); return; }
    setisloading(true);
    fetch(`${backendURL}/resetOtpSent`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((r) => { if (r.ok) { toast.success("OTP sent!"); setStep(2); } else toast.error("Email not found"); })
      .catch(() => toast.error("Failed to send OTP"))
      .finally(() => setisloading(false));
  };

  const handleOtpInput = (index, event) => {
    const val = event.target.value.replace(/\D/, "");
    if (!val) { event.target.value = ""; return; }
    const tmp = [...otp]; tmp[index] = val; setotp(tmp);
    if (index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKey = (index, event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const tmp = [...otp]; tmp[index] = ""; setotp(tmp);
      event.target.value = "";
      if (index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const verifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) { toast.error("Enter all 6 digits"); return; }
    setisloading(true);
    fetch(`${backendURL}/verifyResetOtp`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: enteredOtp }),
    })
      .then((r) => {
        if (r.ok) { toast.success("OTP verified"); setStep(3); }
        else { setotp(["", "", "", "", "", ""]); toast.error("Invalid OTP"); }
      })
      .catch(() => toast.error("Verification failed"))
      .finally(() => setisloading(false));
  };

  const resetPassword = () => {
    const enteredOtp = otp.join("");
    if (newpassword.length < 6) { toast.warn("Password must be at least 6 characters"); return; }
    if (newpassword !== confirmpassword) { toast.warn("Passwords don't match"); return; }
    setisloading(true);
    fetch(`${backendURL}/resetPassword`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: enteredOtp, password: newpassword }),
    })
      .then((r) => {
        if (r.ok) {
          toast.success("Password reset successfully!");
          navigate("/login");
        } else toast.error("Reset failed");
      })
      .catch(() => toast.error("Reset failed"))
      .finally(() => setisloading(false));
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.bgGlow} />

      <div className={styles.center}>
        {/* Progress indicator */}
        <div className={styles.steps}>
          {["Email", "Verify", "Reset"].map((s, i) => (
            <div key={s} className={styles.stepItem}>
              <div className={`${styles.stepCircle} ${step > i + 1 ? styles.stepDone : step === i + 1 ? styles.stepActive : ""}`}>
                {step > i + 1
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                  : i + 1
                }
              </div>
              <span className={`${styles.stepLabel} ${step === i + 1 ? styles.stepLabelActive : ""}`}>{s}</span>
              {i < 2 && <div className={`${styles.stepLine} ${step > i + 1 ? styles.stepLineDone : ""}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="url(#eg)" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
                <defs><linearGradient id="eg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#2563eb"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs>
              </svg>
            </div>
            <h2 className={styles.cardTitle}>Reset Password</h2>
            <p className={styles.cardSubtitle}>Enter your email and we'll send a verification code.</p>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                className={styles.input}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                autoComplete="off"
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
              />
            </div>
            <button className={styles.submitBtn} onClick={sendOtp} disabled={isloading}>
              {isloading ? <><span className={styles.btnSpinner}/> Sending...</> : "Send OTP"}
            </button>
            <button className={styles.backBtn} onClick={() => navigate("/login")}>← Back to Sign In</button>
          </div>
        )}

        {step === 2 && (
          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="url(#sg)" strokeWidth="2">
                <rect x="5" y="11" width="14" height="10" rx="2"/>
                <path d="M8 11V7a4 4 0 018 0v4"/>
                <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#2563eb"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs>
              </svg>
            </div>
            <h2 className={styles.cardTitle}>Enter OTP</h2>
            <p className={styles.cardSubtitle}>
              6-digit code sent to <strong style={{ color: "var(--text-primary)" }}>{email}</strong>
            </p>
            <div className={styles.otpRow}>
              {otp.map((val, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  autoComplete="off"
                  className={`${styles.otpInput} ${val ? styles.otpFilled : ""}`}
                  onChange={(e) => handleOtpInput(idx, e)}
                  onKeyDown={(e) => handleOtpKey(idx, e)}
                  placeholder="·"
                />
              ))}
            </div>
            <button className={styles.submitBtn} onClick={verifyOtp} disabled={isloading}>
              {isloading ? <><span className={styles.btnSpinner}/> Verifying...</> : "Verify OTP"}
            </button>
            <button className={styles.backBtn} onClick={() => { setStep(1); setotp(["","","","","",""]); }}>← Change Email</button>
          </div>
        )}

        {step === 3 && (
          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="url(#kg)" strokeWidth="2">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                <defs><linearGradient id="kg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#2563eb"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs>
              </svg>
            </div>
            <h2 className={styles.cardTitle}>New Password</h2>
            <p className={styles.cardSubtitle}>Set a strong new password for your account.</p>
            <div className={styles.field}>
              <label className={styles.label}>New Password</label>
              <div className={styles.passwordWrap}>
                <input
                  type={showpass ? "text" : "password"}
                  className={styles.input}
                  placeholder="Min. 6 characters"
                  value={newpassword}
                  onChange={(e) => setnewpassword(e.target.value)}
                  autoComplete="off"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setshowpass((p) => !p)}>
                  {showpass
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Confirm Password</label>
              <div className={styles.passwordWrap}>
                <input
                  type={showconfirmpass ? "text" : "password"}
                  className={styles.input}
                  placeholder="Re-enter password"
                  value={confirmpassword}
                  onChange={(e) => setconfirmpassword(e.target.value)}
                  autoComplete="off"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setshowconfirmpass((p) => !p)}>
                  {showconfirmpass
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>
            <button className={styles.submitBtn} onClick={resetPassword} disabled={isloading}>
              {isloading ? <><span className={styles.btnSpinner}/> Resetting...</> : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Forgotpassword;