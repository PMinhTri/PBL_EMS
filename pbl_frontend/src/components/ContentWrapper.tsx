import React from "react";

export type Props = {
  children: React.ReactNode;
};

const ContentWrapper: React.FunctionComponent<Props> = ({ children }) => {
  return <div className="flex flex-row mt-12 w-full">{children}</div>;
};

export default ContentWrapper;
