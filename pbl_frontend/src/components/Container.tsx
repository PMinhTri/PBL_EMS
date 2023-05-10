import React from "react";

type Props = {
  backgroundColor?: string;
  children: React.ReactNode;
};

const Container: React.FunctionComponent<Props> = (props: Props) => {
  const { backgroundColor, children } = props;

  return <div className={`flex flex-col bg-${backgroundColor}`}>{children}</div>;
};

export default Container;
