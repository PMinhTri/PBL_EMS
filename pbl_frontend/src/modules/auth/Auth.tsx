import React from "react";
import { Outlet } from "react-router-dom";

const Auth: React.FunctionComponent = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default Auth;
