import React, { useCallback, useState } from "react";
import { TimelineModel } from "src/models/TimelineModel";
import Switch from "../../../../components/Switch";
import styles from "./list.module.css";
import commonUtil from "src/utils/commonUtil";

interface Props {
  videoList: string[];
  videoIdx: number;
  autoPlay: boolean;
  savedTimes: TimelineModel[];
  onChangeTime: (value: number) => void;
  onChangeAutoPlay: (value: boolean) => void;
  onClickVideo: (value: number) => void;
}

const VideoList = ({
  videoList,
  videoIdx,
  savedTimes,
  autoPlay,
  onChangeTime,
  onChangeAutoPlay,
  onClickVideo,
}: Props) => {
  const [openList, setOpenList] = useState<boolean>(false);

  const getName = useCallback(
    (value: string) => {
      const arr = value.split("/");
      return arr[arr.length - 1].split(".")[0];
    },
    [videoList]
  );

  const selectVideo = (i: number) => {
    onClickVideo(i);
    setOpenList(false);
  };

  return (
    <>
      <div className={styles.div_list}>
        <img
          src="/assets/images/list.svg"
          title="Playlist"
          onClick={() => setOpenList(!openList)}
        />
      </div>
      {openList && (
        <div className={styles.div_bg} onClick={() => setOpenList(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <div className={styles.div_head}>
              <p>Playlist ({videoList.length})</p>
              <div>
                autoplay
                <Switch checked={autoPlay} onChange={onChangeAutoPlay} />
              </div>
            </div>
            <ul className={styles.ul_list} onClick={() => setOpenList(false)}>
              {videoList.map((e, i) => {
                return (
                  <li
                    key={`video-${i}`}
                    className={i === videoIdx ? styles.li_selected : undefined}
                    onClick={() => selectVideo(i)}>
                    {getName(e)}
                  </li>
                );
              })}
            </ul>

            {savedTimes.length > 0 && (
              <>
                <div className={styles.div_head}>
                  Saved timeline ({savedTimes.length})
                </div>
                <ul className={styles.ul_list}>
                  {savedTimes.map((e, i) => {
                    return (
                      <li
                        key={`time_${i}`}
                        onClick={() => onChangeTime(e.startTime)}>
                        {e.img && <img src={e.img} />}
                        {commonUtil.secondsToHMS(e.startTime)} -{" "}
                        {commonUtil.secondsToHMS(e.endTime)}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VideoList;
