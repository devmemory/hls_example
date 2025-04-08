import React from "react";
import { DurationModel } from "src/models/DurationModel";
import commonUtil from "src/utils/commonUtil";

const Time = ({ current, total }: DurationModel) => {
  return (
    <div>
      {commonUtil.secondsToHMS(current)} / {commonUtil.secondsToHMS(total)}
    </div>
  );
};

export default Time;
