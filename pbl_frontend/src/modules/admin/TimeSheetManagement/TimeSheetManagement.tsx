import React from "react";
import TimeSheetTable from "./components/TimeSheetTable";

const TimeSheetManagement: React.FunctionComponent = () => {
  return (
    <div className="w-full p-4 flex flex-col overflow-auto">
      <TimeSheetTable />
    </div>
  );
};

export default TimeSheetManagement;
