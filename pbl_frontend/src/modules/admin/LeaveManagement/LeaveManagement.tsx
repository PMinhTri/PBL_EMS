import React from "react";
import LeaveBalanceManagement from "./components/LeaveBalanceManagement";
import LeaveRequestManagement from "./components/LeaveRequestManagement";

const LeaveManagement: React.FunctionComponent = () => {
  return (
    <div className="flex flex-col w-full h-full overflow-auto p-4">
      <LeaveBalanceManagement />
      <LeaveRequestManagement />
    </div>
  );
};

export default LeaveManagement;
