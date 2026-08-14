import styles from "./PageLoader.module.css";

function PageLoader({ text = "Analysing Resume" }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.spinner}>
          <div className={styles.ring}><div className={styles.dot}/></div>
          <div className={styles.glow}/>
        </div>
        <p className={styles.text}>{text}</p>
        <div className={styles.dots}>
          <span/><span/><span/>
        </div>
      </div>
    </div>
  );
}

export default PageLoader;