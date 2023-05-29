import React from "react";
import { RequestForm } from "./components/RequestForm";
import RequestHistory from "./components/RequestHistory";

export const LeaveRequest: React.FunctionComponent = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-300">
      <div className="flex-grow p-6 overflow-y-auto">
        <RequestForm />
        <RequestHistory />
      </div>
      <footer className="py-4 px-6 bg-gray-200 text-gray-600 text-center"></footer>
    </div>
  );
};

export default LeaveRequest;
