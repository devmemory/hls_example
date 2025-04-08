import { Level } from "hls.js";
import React, { ChangeEventHandler } from "react";
import sampleData from "src/data/sampleData";
import { DurationModel } from "src/models/DurationModel";
import Quality from "./Quality";
import Time from "./Time";
import Volume from "./Volume";
import styles from "./control.module.css";

interface Props {
  duration: DurationModel;
  videoList: string[];
  isPlaying: boolean;
  togglePlay: () => void;
  isFullScreen: boolean;
  toggleScreenMode: () => void;
  levelList: Level[];
  levelIdx: number;
  saveMode: boolean;
  toggleSaveMode: () => void;
  onChangeTime: (value: number) => void;
  onChangeLevel: (value: number) => void;
  onNextVideo: () => void;
  onPreviousVideo: () => void;
  onChangeVolume: (value: number) => void;
}

const Control = (props: Props) => {
  const noVideoList = props.videoList.length < 2;

  const onChangeVideo = (isNext: boolean) => {
    if (noVideoList) {
      return;
    }

    if (isNext) {
      props.onNextVideo();
    } else {
      props.onPreviousVideo();
    }
  };

  return (
    <div className={styles.div_control}>
      <label>
        <input
          type="range"
          min={0}
          max={props.duration.total}
          value={props.duration.current}
          onChange={(e) => props.onChangeTime(Number(e.target.value))}
        />
      </label>
      <div>
        <div className={noVideoList ? styles.disable_video : undefined}>
          <img
            src={
              props.isPlaying
                ? "/assets/images/pause.svg"
                : "/assets/images/play.svg"
            }
            title={props.isPlaying ? "Pause" : "Play"}
            onClick={props.togglePlay}
          />

          <Volume onChangeVolume={props.onChangeVolume} />
          <img
            className={styles.img_rotate}
            src="/assets/images/next.svg"
            title="Next video"
            onClick={() => onChangeVideo(false)}
          />
          <img
            src="/assets/images/next.svg"
            title="Previous video"
            onClick={() => onChangeVideo(true)}
          />
          <Time {...props.duration} />
        </div>
        <div>
          <img
            src={
              props.saveMode
                ? "/assets/images/timeline_active.svg"
                : "/assets/images/timeline.svg"
            }
            title={props.saveMode ? "Stop" : "Record"}
            onClick={props.toggleSaveMode}
          />
          <img
            src={
              props.isFullScreen
                ? "/assets/images/shrink.svg"
                : "/assets/images/expand.svg"
            }
            title={props.isFullScreen ? "Close" : "Full screen"}
            onClick={props.toggleScreenMode}
          />
          <Quality
            levelList={props.levelList}
            levelIdx={props.levelIdx}
            onChangeLevel={props.onChangeLevel}
          />
        </div>
      </div>
    </div>
  );
};

export default Control;
