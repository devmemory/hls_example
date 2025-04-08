import React, { ChangeEvent, useEffect, useState } from "react";
import { KEY_CODE } from "src/data/constants";
import styles from "./control.module.css";

interface Props {
  onChangeVolume: (value: number) => void;
}

const Volume = ({ onChangeVolume }: Props) => {
  const [volume, setVolume] = useState({ value: 1, temp: 1 });
  const [openVolume, setOpenVolume] = useState<boolean>(false);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      let value = volume.value;
      let isCalled = false;

      switch (e.code) {
        case KEY_CODE.arrowUp:
          if (value < 1) {
            value = Number((value + 0.1).toFixed(1));
            isCalled = true;
          }
          break;
        case KEY_CODE.arrowDown:
          if (value > 0) {
            value = Number((value - 0.1).toFixed(1));
            isCalled = true;
          }
          break;
      }

      if (isCalled) {
        setVolume({ value, temp: value });
        onChangeVolume(value);
      }
    };

    document.addEventListener("keydown", keydown);

    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, [volume]);

  /** - change volume */
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    setVolume({ value, temp: value });
    onChangeVolume(value);
  };

  /** - toggle mute, volume */
  const onClick = () => {
    const value = volume.value === 0 ? volume.temp : 0;

    setVolume((state) => {
      return { ...state, value };
    });
    onChangeVolume(value);
  };

  return (
    <div
      className={styles.div_volume}
      onMouseEnter={() => setOpenVolume(true)}
      onMouseLeave={() => setOpenVolume(false)}>
      <img
        src={
          volume.value === 0
            ? "/assets/images/mute.svg"
            : "/assets/images/sound.svg"
        }
        onClick={onClick}
      />
      {openVolume && (
        <label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume.value}
            onChange={onChange}
          />
        </label>
      )}
    </div>
  );
};

export default Volume;
