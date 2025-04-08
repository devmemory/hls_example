import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { routeName } from "src/utils/routeUtil";
import styles from "src/styles/toast.module.css";

const useCustomToast = () => {
  const navigate = useNavigate();

  const onOpenToast = () => {
    toast.error(
      (t) => {
        const goToUpload = () => {
          navigate(routeName.upload);
          toast.dismiss(t.id);
        };

        return (
          <div className={styles.div_toast}>
            Video list is empty.
            <button onClick={goToUpload}>Go to upload</button>
          </div>
        );
      },
      { duration: 5000 }
    );
  };

  return { onOpenToast };
};

export default useCustomToast;
