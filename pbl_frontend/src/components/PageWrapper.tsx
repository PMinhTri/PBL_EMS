import React from "react";

export type Props = {
  children: React.ReactNode;
};

const PageWrapper: React.FunctionComponent<Props> = ({ children }) => {
  return (
    <div className="flex fixed right-0 w-[calc(100%-16rem)] h-screen">
      {children}
    </div>
  );
};

export default PageWrapper;
