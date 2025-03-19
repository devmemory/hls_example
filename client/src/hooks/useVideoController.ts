import { useQuery } from "@tanstack/react-query";
import Hls, { Events, Level } from "hls.js";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { KEY_CODE } from "src/data/constants";
import { DurationModel } from "src/models/DurationModel";
import { SaveTimeModel, TimelineModel } from "src/models/TimelineModel";
import { getVideoList } from "src/services/videoApi";
import commonUtil from "src/utils/commonUtil";

const useVideoController = () => {
  const { data } = useQuery({
    queryKey: ["video_list"],
    queryFn: getVideoList,
  });

  const videoList = data ?? [];

  const videoRef = useRef<HTMLVideoElement>(null);

  /** - video, control element */
  const container = useRef<HTMLDivElement>(null);

  /** - hls */
  const hlsRef = useRef<Hls>(null);

  /** - throttle */
  const isCalled = useRef<boolean>(false);

  /** - to prevent auto play */
  const startFlag = useRef<boolean>(false);

  /** - video quality levels */
  const [levelList, setLevelList] = useState<Level[]>([]);

  /** - video total and current duration */
  const [duration, setDuration] = useState<DurationModel>({
    current: 0,
    total: 0,
  });

  /** - loading for video */
  const [loading, setLoading] = useState<boolean>(false);

  /** - selected video idx */
  const [videoIdx, setVideoIdx] = useState<number>(0);

  /** - quality level idx */
  const [levelIdx, setLevelIdx] = useState<number>(0);

  /** - to toggle button */
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  /** - check screen mode */
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  /** - video error msg */
  const [videoError, setVideoError] = useState<string>();

  /** - play next video automatically */
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  /** - saved time line */
  const [savedTimes, setSavedTimes] = useState<TimelineModel[]>([]);

  /** - save mode on/off */
  const [saveMode, setSaveMode] = useState<SaveTimeModel>({
    start: false,
    startTime: 0,
    endTime: 0,
  });

  // init media and listener
  useEffect(() => {
    if (videoList.length > 0) {
      _setVideoListener();
      _initMedia();
    }

    return () => {
      _setVideoListener(true);
      _reset();
    };
  }, [videoList, videoIdx]);

  // screen mode change
  useEffect(() => {
    document.onfullscreenchange = () => {
      setIsFullScreen(!isFullScreen);
    };

    return () => {
      document.onfullscreenchange = null;
    };
  }, [isFullScreen]);

  // save timeline
  useEffect(() => {
    if (saveMode.startTime < saveMode.endTime) {
      const { startTime, endTime, img } = saveMode;

      setSavedTimes([...savedTimes, { startTime, endTime, img }]);
    }
  }, [saveMode]);

  // space : play/pause toggle, left/right arrow : move video time
  useEffect(() => {
    document.addEventListener("keydown", _onKeyDown);

    return () => {
      document.removeEventListener("keydown", _onKeyDown);
    };
  }, [isPlaying, duration.current]);

  /** - set video url */
  const _initMedia = async () => {
    setLoading(true);

    const url = `/api/video/${videoList[videoIdx]}/master.m3u8`;

    console.log({ url, videoList });

    if (Hls.isSupported()) {
      hlsRef.current = new Hls();
      hlsRef.current.loadSource(url);
      hlsRef.current.attachMedia(videoRef.current!);

      hlsRef.current.on(Events.MANIFEST_PARSED, (_, data) => {
        console.log({ data });
        setLevelIdx(data.firstLevel);
        setLevelList(data.levels);
      });
    } else {
      toast.error("This browser doesn't support HLS");
      videoRef.current!.src = url;
    }
  };

  /** - set video listeners */
  const _setVideoListener = (reset = false) => {
    if (reset) {
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = null;
        videoRef.current.oncanplay = null;
        videoRef.current.ontimeupdate = null;
        videoRef.current.onended = null;
        videoRef.current.onplay = null;
        videoRef.current.onpause = null;
        videoRef.current.onerror = null;
      }
    } else {
      videoRef.current!.onloadedmetadata = _onLoadMetaData;
      videoRef.current!.oncanplay = _canPlayVideo;
      videoRef.current!.ontimeupdate = _onPlayingTimeUpdate;
      videoRef.current!.onended = onNextVideo;
      videoRef.current!.onplay = () => {
        setIsPlaying(true);
      };
      videoRef.current!.onpause = () => {
        setIsPlaying(false);
      };
      videoRef.current!.onerror = (e) => {
        setVideoError(`[Error] ${JSON.stringify(e)}`);
      };
    }
  };

  /** - setting duration */
  const _onLoadMetaData = (e: Event) => {
    const target = e.target as HTMLVideoElement;

    setDuration((state) => {
      return { ...state, total: target.duration };
    });

    if (startFlag.current && autoPlay) {
      _play();
    }
  };

  /** - check if video is playable */
  const _canPlayVideo = () => {
    if (videoRef.current!.readyState === 4) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  };

  /** - move to the next video */
  const onNextVideo = () => {
    const nextIdx = videoIdx + 1;

    if (nextIdx < videoList.length) {
      setVideoIdx(nextIdx);
    } else {
      setVideoIdx(0);
    }
  };

  /** - move to previous video */
  const onPreviousVideo = () => {
    const previousIdx = videoIdx - 1;

    if (previousIdx >= 0) {
      setVideoIdx(previousIdx);
    } else {
      setVideoIdx(videoList.length - 1);
    }
  };

  /** - update playing time */
  const _onPlayingTimeUpdate = (e: Event) => {
    // when level is changed, stop updating
    if (videoRef.current?.paused) {
      return;
    }

    const target = e.target as HTMLVideoElement;

    setDuration((state) => {
      return { ...state, current: target.currentTime };
    });
  };

  /** - reset video data and remove listener, saved times */
  const _reset = () => {
    hlsRef.current?.destroy();

    setLevelList([]);
    setSavedTimes([]);
    setSaveMode({ start: false, startTime: 0, endTime: 0 });
    setDuration({ current: 0, total: 0 });
  };

  /** - keyboard event */
  const _onKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case KEY_CODE.space:
        togglePlay();
        break;
      case KEY_CODE.arrowRight:
        seek(duration.current + 1);
        break;
      case KEY_CODE.arrowLeft:
        seek(duration.current - 1);
        break;
    }
  };

  /** - play video */
  const _play = async () => {
    if (videoRef.current!.paused) {
      await videoRef.current?.play();
    }
  };

  /** - pause video */
  const _pause = () => {
    if (!videoRef.current!.paused) {
      videoRef.current?.pause();
    }
  };

  /** - move to position */
  const seek = (time: number) => {
    if (isCalled.current) {
      return;
    } else {
      isCalled.current = true;

      commonUtil.delay(100).then(() => {
        isCalled.current = false;
      });
    }

    videoRef.current!.currentTime = time;

    setLoading(true);

    setDuration((state) => {
      return { ...state, current: time };
    });
  };

  /** - change volume */
  const onChangeVolume = (value: number) => {
    videoRef.current!.volume = value;
  };

  /** - toggle screen mode */
  const toggleScreenMode = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      container.current?.requestFullscreen();
    }
  };

  /** - toggle play/pause */
  const togglePlay = () => {
    if (isPlaying) {
      _pause();
    } else {
      if (!startFlag.current) {
        startFlag.current = true;
      }
      _play();
    }
  };

  /** - toggle save time mode */
  const toggleSaveMode = async () => {
    let img: string | undefined;
    if (!saveMode.start) {
      img = await _getThumbnail();
      console.log({ img });
    }

    setSaveMode((state) => {
      if (state.start) {
        return { ...state, start: !state.start, endTime: duration.current };
      } else {
        return {
          ...state,
          start: !state.start,
          startTime: duration.current,
          img,
        };
      }
    });
  };

  /** - get thumbnail from video */
  const _getThumbnail = async () => {
    const canvas = await html2canvas(videoRef.current!, { scale: 0.1 });
    const imageFile = canvas.toDataURL("image/jpg", 0.1);

    return imageFile;
  };

  /** - change quality level */
  const onChangeLevel = (i: number) => {
    setLevelIdx(i);

    hlsRef.current!.currentLevel = i;

    if (startFlag.current) {
      hlsRef.current!.detachMedia();

      hlsRef.current!.attachMedia(videoRef.current!);

      setLoading(true);
      _pause();
    }
  };

  return {
    container,
    videoRef,
    levelList,
    levelIdx,
    videoList,
    videoIdx,
    setVideoIdx,
    duration,
    isFullScreen,
    toggleScreenMode,
    togglePlay,
    toggleSaveMode,
    saveMode,
    savedTimes,
    seek,
    loading,
    onChangeVolume,
    isPlaying,
    onNextVideo,
    onPreviousVideo,
    videoError,
    autoPlay,
    setAutoPlay,
    onChangeLevel,
    startFlag,
  };
};

export default useVideoController;
