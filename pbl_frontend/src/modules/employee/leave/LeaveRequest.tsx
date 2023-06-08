import React from "react";
import { RequestForm } from "./components/RequestForm";
import RequestHistory from "./components/RequestHistory";
import { useRecoilValue } from "recoil";
import userSelector from "../../../recoil/selectors/user";

export const LeaveRequest: React.FunctionComponent = () => {
  const { userAuthInfo } = useRecoilValue(userSelector);
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-300">
      <div className="flex-grow p-6 overflow-y-auto">
        <RequestForm />
        <RequestHistory userId={userAuthInfo.id} year={currentYear} />
      </div>
      <footer className="py-4 px-6 bg-gray-200 text-gray-600 text-center"></footer>
    </div>
  );
};

export default LeaveRequest;
