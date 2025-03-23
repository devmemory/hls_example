import React, { ReactNode } from "react";

interface Props {
  when: boolean;
  children: ReactNode;
}

const LabelComponent = () => {};

LabelComponent.Loading = ({ when, children }: Props) => {
  return <>{when && children}</>;
};

LabelComponent.Indicator = ({ when, children }: Props) => {
  return <>{when && children}</>;
};

LabelComponent.Text = ({ when, children }: Props) => {
  return <>{when && children}</>;
};

export default LabelComponent;
