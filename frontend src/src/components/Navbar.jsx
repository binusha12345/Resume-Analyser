import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usercontext } from "../appcontext";
import { toast } from "react-toastify";
import styles from "./Navbar.module.css";

function Navbar({ showHome = false }) {
  const navigate = useNavigate();
  const {
    islogged,
    username,
    serviceURL,
    setusername,
    setislogged,
    setisprevious,
  } = useContext(usercontext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    setLoading(true);
    fetch(`${serviceURL}/logout`, { method: "post", credentials: "include" })
      .then((r) => {
        if (r.ok) {
          setusername("");
          setislogged(false);
          setisprevious(false);
          toast.success("Logged out successfully");
          navigate("/login");
        } else {
          toast.error("Logout failed");
        }
      })
      .catch(() => toast.error("Network error"))
      .finally(() => setLoading(false));
  };

  const deleteAccount = () => {
    setDelLoading(true);
    fetch(`${serviceURL}/deleteAccount`, {
      method: "post",
      credentials: "include",
    })
      .then((r) => {
        if (r.ok) {
          setislogged(false);
          setusername("");
          setisprevious(false);
          toast.success("Account deleted");
          navigate("/login");
        } else {
          toast.error("Could not delete account");
        }
      })
      .catch(() => toast.error("Network error"))
      .finally(() => setDelLoading(false));
  };

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.brand} onClick={() => navigate("/")}>
            <div className={styles.brandIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12h6M9 16h6M9 8h2M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"
                  stroke="url(#navBrandGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="navBrandGrad"
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
            <span className={styles.brandText}>
              Resume<span>Analyser</span>
            </span>
          </div>

          <div className={styles.navActions}>
            {showHome && (
              <button className={styles.navBtn} onClick={() => navigate("/")}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
                Home
              </button>
            )}
            {!islogged ? (
              <button
                className={styles.loginBtn}
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            ) : (
              <div className={styles.profileWrapper} ref={menuRef}>
                <button
                  className={styles.avatar}
                  onClick={() => setMenuOpen((p) => !p)}
                  aria-label="Profile menu"
                >
                  {username[0]?.toUpperCase()}
                </button>
                {menuOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownAvatar}>
                        {username[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className={styles.dropdownName}>{username}</p>
                        <p className={styles.dropdownRole}>Signed in</p>
                      </div>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <button
                      className={styles.dropdownItem}
                      onClick={logout}
                      disabled={loading}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                      </svg>
                      {loading ? "Logging out..." : "Logout"}
                    </button>
                    <button
                      className={`${styles.dropdownItem} ${styles.dropdownDanger}`}
                      onClick={() => {
                        setMenuOpen(false);
                        setShowDeleteModal(true);
                      }}
                      disabled={loading}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3,6 5,6 21,6" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                      </svg>
                      Delete Account
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {showDeleteModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => !delLoading && setShowDeleteModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className={styles.modalTitle}>Delete Account?</h3>
            <p className={styles.modalDesc}>
              This action is <strong>permanent</strong> and cannot be undone. All
              your data, analyses, and history will be erased immediately.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancel}
                onClick={() => setShowDeleteModal(false)}
                disabled={delLoading}
              >
                Cancel
              </button>
              <button
                className={styles.modalDelete}
                onClick={deleteAccount}
                disabled={delLoading}
              >
                {delLoading ? (
                  <>
                    <span className={styles.btnSpinner} />
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;