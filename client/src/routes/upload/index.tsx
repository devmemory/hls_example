import React from "react";
import Loading from "src/components/Loading";
import useUploadController from "src/hooks/upload/useUploadController";
import LabelComponent from "./LabelComponent";
import styles from "./upload.module.css";

const UploadPage = () => {
  const controller = useUploadController();

  return (
    <div className={styles.div_container}>
      <label
        className={`${styles.label_file} ${controller.isIn ? styles.in : ""} ${controller.isLoading ? styles.pending : ""}`}
        onClick={controller.onClickPrevent}
        onDragOver={controller.onDragEnter}
        onDragLeave={controller.onDragLeave}
        onDrop={controller.onDropFiles}>
        <LabelComponent.Loading when={controller.isLoading}>
          <Loading centerFloat={false} />
        </LabelComponent.Loading>
        <LabelComponent.Indicator when={controller.percent !== 0}>
          <div>uploading - {controller.percent}%</div>
        </LabelComponent.Indicator>
        <LabelComponent.Text
          when={!controller.isLoading && controller.percent === 0}>
          <div className={styles.div_upload_btn}>
            Click here to upload video file
            <img
              className={styles.img_upload}
              width={30}
              height={30}
              src="/assets/images/upload.svg"
              onClick={controller.onOpenExplorer}
            />
          </div>
          <p>Or</p>
          <div>Video file in box</div>
          {controller.errMsg && (
            <p className={styles.p_error}>{controller.errMsg}</p>
          )}
        </LabelComponent.Text>
      </label>
      <input
        ref={controller.ref}
        className="hidden"
        type="file"
        onChange={controller.onChangeFile}
      />
    </div>
  );
};

export default UploadPage;
