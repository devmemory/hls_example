import React from "react";
import styles from "./switch.module.css";

interface Props {
  checked: boolean;
  onChange: (value: boolean) => void;
}

const Switch = ({ checked, onChange }: Props) => {
  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={`${styles.slider} ${styles.round}`}></span>
    </label>
  );
};

export default Switch;
