import React, { useEffect, useState } from "react";
import commonUtil from "src/utils/commonUtil";
import styles from "./overlay.module.css";

interface Props {
  isPlaying: boolean;
  saveMode: boolean;
  startFlag: boolean;
}

const Overlay = ({ isPlaying, saveMode, startFlag }: Props) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (startFlag) {
      showOverlay();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (saveMode) {
      showOverlay();
    }
  }, [saveMode]);

  const showOverlay = () => {
    setShow(true);
    commonUtil.delay(500).then(() => {
      setShow(false);
    });
  };

  const getImg = () => {
    if (saveMode) {
      return "/assets/images/timeline.svg";
    }

    return isPlaying ? "/assets/images/play.svg" : "/assets/images/pause.svg";
  };

  return (
    <>
      {show && (
        <div className={styles.div_overlay}>
          <img
            className={isPlaying && !saveMode ? styles.img_play : undefined}
            src={getImg()}
          />
        </div>
      )}
    </>
  );
};

export default Overlay;
