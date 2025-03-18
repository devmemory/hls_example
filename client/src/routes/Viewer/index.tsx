import React from "react";
import Loading from "src/components/Loading";
import useVideoController from "src/hooks/useVideoController";
import Control from "src/routes/Viewer/components/Control";
import Overlay from "src/routes/Viewer/components/Overlay";
import VideoList from "src/routes/Viewer/components/VideoList";
import styles from "./viewer.module.css";

const ViewerPage = () => {
  const controller = useVideoController();

  return (
    <div>
      {controller.videoError !== undefined ? (
        <p className={styles.p_error}>{controller.videoError}</p>
      ) : (
        <div
          ref={controller.container}
          className={
            controller.isFullScreen
              ? `${styles.div_container} ${styles.full_screen}`
              : styles.div_container
          }>
          {controller.loading && <Loading />}
          <video ref={controller.videoRef} onClick={controller.togglePlay} />
          <Overlay
            isPlaying={controller.isPlaying}
            saveMode={controller.saveMode.start}
            startFlag={controller.startFlag.current}
          />
          <Control
            {...controller}
            saveMode={controller.saveMode.start}
            onChangeTime={controller.seek}
          />
          <VideoList
            {...controller}
            onChangeTime={controller.seek}
            onChangeAutoPlay={controller.setAutoPlay}
            onClickVideo={controller.setVideoIdx}
          />
        </div>
      )}
    </div>
  );
};

export default ViewerPage;
