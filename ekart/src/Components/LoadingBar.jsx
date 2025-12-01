import React from "react";
import styles from "../Modules/LoadingBar.module.css";

function LoadingBar() {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.loadingText}>
         Loading... <br />
        Due to Cold Start server can take time
      </div>

      <div className={styles.dots}>
        <div></div>
      </div>
    </div>
  );
}

export default LoadingBar;
