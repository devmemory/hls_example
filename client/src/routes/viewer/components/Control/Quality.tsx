import React, { useState } from "react";
import styles from "./control.module.css";
import { Level } from "hls.js";

interface Props {
  levelList: Level[];
  levelIdx: number;
  onChangeLevel: (value: number) => void;
}

const Quality = ({ levelList, levelIdx, onChangeLevel }: Props) => {
  const [openQuality, setOpenQuality] = useState<boolean>(false);

  return (
    <>
      {levelList.length > 1 && (
        <div
          className={styles.div_quality}
          onMouseEnter={() => setOpenQuality(true)}
          onMouseLeave={() => setOpenQuality(false)}>
          <img src="/assets/images/option.svg" />
          {openQuality && (
            <ul>
              {levelList.map((e, i) => {
                return (
                  <li
                    key={`level-${i}`}
                    className={i === levelIdx ? styles.li_selected : undefined}
                    onClick={() => onChangeLevel(i)}>
                    {e.name}p
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default Quality;
