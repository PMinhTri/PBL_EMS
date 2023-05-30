import React from "react";
import TimeSheetTable from "./components/TimeSheetTable";

const TimeSheetManagement: React.FunctionComponent = () => {
  return (
    <div className="w-full flex flex-col bg-slate-300">
      <div className="flex-grow p-6 overflow-y-auto">
        <TimeSheetTable />
      </div>
      <footer className="py-4 px-6 bg-gray-200 text-gray-600 text-center"></footer>
    </div>
  );
};

export default TimeSheetManagement;
