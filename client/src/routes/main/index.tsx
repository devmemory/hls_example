import React from "react";
import { useNavigate } from "react-router-dom";
import { routeName } from "src/utils/routeUtil";
import styles from "./main.module.css";

const MainPage = () => {
  const navigate = useNavigate();

  const onMoveToUpload = () => {
    navigate(routeName.upload);
  };

  const onMoveToViewer = () => {
    navigate(routeName.viewer);
  };

  return (
    <div className={styles.div_container}>
      <button onClick={onMoveToUpload}>upload page</button>
      <button onClick={onMoveToViewer}>viewer page</button>
    </div>
  );
};

export default MainPage;
