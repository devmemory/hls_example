import React from "react";
import styles from "./loading.module.css";

const Loading = ({ centerFloat = true }: { centerFloat?: boolean }) => {
  return (
    <>
      {centerFloat ? (
        <div className={styles.bg}>
          <div className={styles.loading} />
        </div>
      ) : (
        <div className={styles.loading} />
      )}
    </>
  );
};

export default Loading;
