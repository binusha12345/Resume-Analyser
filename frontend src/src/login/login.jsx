import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { usercontext } from "../appcontext";
import { useNavigate, Link } from "react-router-dom";
import GoogleButton from "../googlebtn.jsx";
import Navbar from "../components/Navbar";
import styles from "./login.module.css";

const EyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8
      a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4
      c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19
      m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>
  </svg>
);

function Login() {
  const navigate = useNavigate();
  const {
    backendURL,
    setisprevious,
    setusername,
    setislogged,
    islogged,
  } = useContext(usercontext);

  const [islogin, setislogin] = useState(true);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [isloading, setisloading] = useState(false);
  const [isemailverified, setemailverified] = useState(false);
  const [otp, setotp] = useState(["", "", "", "", "", ""]);
  const [showpass, setshowpass] = useState(false);
  const [showconfirmpass, setshowconfirmpass] = useState(false);

  useEffect(() => {
    if (islogged) navigate("/");
  }, [islogged]);

  function validateEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  const submit = (event) => {
    event.preventDefault();
    if (!islogin) {
      if (!name.trim()) { toast.warn("Username required"); return; }
      if (!email.trim()) { toast.warn("Email required"); return; }
      if (!validateEmail(email.trim())) { toast.warn("Invalid email"); return; }
      if (password.length < 6) { toast.warn("Password must be at least 6 characters"); return; }
      if (password !== confirmpassword) { toast.warn("Passwords don't match"); return; }

      setisloading(true);
      fetch(`${backendURL}/verifyEmail`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name.trim(), email: email.trim() }),
      })
        .then((r) => {
          if (r.ok) { setemailverified(true); }
          else { toast.error("Email already registered"); }
        })
        .catch(() => toast.error("Signup failed"))
        .finally(() => setisloading(false));
    } else {
      if (!email.trim()) { toast.warn("Email required"); return; }
      if (!validateEmail(email.trim())) { toast.warn("Invalid email"); return; }
      if (password.length < 6) { toast.warn("Password must be at least 6 characters"); return; }

      setisloading(true);
      fetch(`${backendURL}/login`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: "include",
      })
        .then((r) => {
          if (r.ok) {
            setemail(""); setpassword(""); setshowpass(false);
            toast.success("Welcome back!");
            return r.json();
          }
          toast.error("Invalid credentials");
          return null;
        })
        .then((data) => {
          if (data) {
            setislogged(true);
            setusername(data.username);
            setisprevious(data.isPrevious);
            navigate("/");
          }
        })
        .catch(() => toast.error("Login failed"))
        .finally(() => setisloading(false));
    }
  };

  const switchMode = () => {
    setname(""); setemail(""); setpassword(""); setconfirmpassword("");
    setshowpass(false); setshowconfirmpass(false);
    setislogin((p) => !p);
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
    fetch(`${backendURL}/register`, {
      method: "post",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: name.trim(),
        email: email.trim(),
        password,
        verifyotp: enteredOtp,
      }),
    })
      .then((r) => {
        if (r.ok) {
          setotp(["", "", "", "", "", ""]);
          setname(""); setemail(""); setpassword("");
          setconfirmpassword(""); setshowpass(false);
          setshowconfirmpass(false); setemailverified(false);
          setislogin(true);
          toast.success("Account created! Please sign in.");
        } else {
          setotp(["", "", "", "", "", ""]);
          toast.error("Invalid OTP");
        }
      })
      .catch(() => toast.error("Verification failed"))
      .finally(() => setisloading(false));
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.bgGlow} />
      <div className={styles.bgGrid} />

      <div className={styles.center}>
        {!isemailverified ? (
          <div className={styles.card}>
            {/* Brand mark inside card */}
            <div className={styles.brandMark}>
              <div className={styles.brandMarkIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12h6M9 16h6M9 8h2M5 4h14a1 1 0 011 1v14
                       a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className={styles.brandMarkText}>
                Resume<span>Analyser</span>
              </span>
            </div>

            <div className={styles.cardHeader}>
              <h1 className={styles.cardTitle}>
                {islogin ? "Welcome back" : "Create account"}
              </h1>
              <p className={styles.cardSubtitle}>
                {islogin
                  ? "Sign in to access your resume analyses"
                  : "Join thousands improving their resumes"}
              </p>
            </div>

            <form onSubmit={submit} className={styles.form} noValidate>
              {!islogin && (
                <div className={styles.field}>
                  <label className={styles.label}>Username</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. john_doe"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    maxLength={20}
                    autoComplete="off"
                  />
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.label}>Email address</label>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Password</label>
                <div className={styles.passwordWrap}>
                  <input
                    type={showpass ? "text" : "password"}
                    className={styles.input}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setshowpass((p) => !p)}
                    aria-label={showpass ? "Hide password" : "Show password"}
                  >
                    {showpass ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>

              {!islogin && (
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
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() => setshowconfirmpass((p) => !p)}
                      aria-label={
                        showconfirmpass ? "Hide password" : "Show password"
                      }
                    >
                      {showconfirmpass ? <EyeOff /> : <EyeOpen />}
                    </button>
                  </div>
                </div>
              )}

              {islogin && (
                <div className={styles.forgotRow}>
                  <Link to="/forgotpassword" className={styles.forgotLink}>
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isloading}
              >
                {isloading ? (
                  <>
                    <span className={styles.btnSpinner} />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>{islogin ? "Sign In" : "Create Account"}</span>
                )}
              </button>
            </form>

            <p className={styles.switchText}>
              {islogin
                ? "New to Resume Analyser?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                className={styles.switchBtn}
                onClick={switchMode}
              >
                {islogin ? "Sign up" : "Sign in"}
              </button>
            </p>

            <div className={styles.divider}>
              <span>or continue with</span>
            </div>

            <GoogleButton />
          </div>
        ) : (
          /* ===== OTP CARD ===== */
          <div className={styles.card}>
            <div className={styles.otpIcon}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
              >
                <path
                  d="M22 16.92v3a2 2 0 01-2.18 2
                     a19.79 19.79 0 01-8.63-3.07
                     A19.5 19.5 0 013.07 12
                     a19.79 19.79 0 01-3.07-8.67
                     A2 2 0 012 1.13h3a2 2 0 012 1.72
                     a12.84 12.84 0 00.7 2.81
                     a2 2 0 01-.45 2.11L6.09 8.91
                     a16 16 0 006 6l1.27-1.27
                     a2 2 0 012.11-.45
                     a12.84 12.84 0 002.81.7
                     A2 2 0 0122 16.92z"
                  stroke="url(#otpGrad)"
                />
                <defs>
                  <linearGradient
                    id="otpGrad"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop stopColor="#1e3a8a" />
                    <stop offset="1" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className={styles.cardHeader}>
              <h1 className={styles.cardTitle}>Verify Email</h1>
              <p className={styles.cardSubtitle}>
                Enter the 6-digit code sent to{" "}
                <strong style={{ color: "#0f172a", fontWeight: 700 }}>
                  {email}
                </strong>
              </p>
            </div>

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
                  className={`${styles.otpInput} ${
                    val ? styles.otpFilled : ""
                  }`}
                  onChange={(e) => handleOtpInput(idx, e)}
                  onKeyDown={(e) => handleOtpKey(idx, e)}
                  placeholder="·"
                />
              ))}
            </div>

            <button
              className={styles.submitBtn}
              onClick={verifyOtp}
              disabled={isloading}
            >
              {isloading ? (
                <>
                  <span className={styles.btnSpinner} />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify &amp; Create Account</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;