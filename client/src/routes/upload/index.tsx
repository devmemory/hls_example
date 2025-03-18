import React from "react";
import useUploadController from "src/hooks/useUploadController";
import styles from "./upload.module.css";

const UploadPage = () => {
  const controller = useUploadController();

  return (
    <div className={styles.div_container}>
      <label
        className={`${styles.label_file} ${controller.isIn ? styles.in : ""}`}
        onClick={controller.onClickPrevent}
        onDragOver={controller.onDragEnter}
        onDragLeave={controller.onDragLeave}
        onDrop={controller.onDropFiles}>
        {controller.percent !== 0 ? (
          <div>uploading - {controller.percent}%</div>
        ) : (
          <>
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
          </>
        )}
        {controller.errMsg && (
          <p className={styles.p_error}>{controller.errMsg}</p>
        )}
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
