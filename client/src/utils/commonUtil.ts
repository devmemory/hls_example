const commonUtil = {
  delay: (ms: number) => {
    return new Promise<void>((res) => {
      const timer = setTimeout(() => {
        res();
        clearTimeout(timer);
      }, ms);
    });
  },
  secondsToHMS: (s: number) => {
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = Math.floor(s % 60);

    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");

    let timeString = `${mm}:${ss}`;

    if (hours > 0) {
      const hh = String(hours).padStart(2, "0");

      timeString = hh + ":" + timeString;
    }

    return timeString;
  },
};

export default commonUtil;
