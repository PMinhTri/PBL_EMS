import React from "react";
import PayrollTable from "./components/PayrollTable";

const PayrollManagement: React.FunctionComponent = () => {
  return (
    <div className="w-full p-4 flex flex-col overflow-auto">
      <PayrollTable />
      <div>Hello</div>
    </div>
  );
};

export default PayrollManagement;
