import React from "react";
import LeaveBalanceManagement from "./components/LeaveBalanceManagement";
import LeaveRequestManagement from "./components/LeaveRequestManagement";
import { UserDetailInformation } from "../../../types/userTypes";
import { UserAction } from "../../../actions/userAction";

const LeaveManagement: React.FunctionComponent = () => {
  const [employeeList, setEmployeeList] = React.useState<
    UserDetailInformation[]
  >([]);

  React.useEffect(() => {
    const fetchEmployeeList = async () => {
      const employees = await UserAction.getAllEmployees();
      setEmployeeList(employees);
    };

    fetchEmployeeList();
  }, []);
  return (
    <div className="flex flex-col w-full h-full overflow-auto p-4">
      <LeaveRequestManagement employees={employeeList} />
      <LeaveBalanceManagement employees={employeeList} />
      <footer className="py-4 px-6 bg-gray-200 text-gray-600 text-center"></footer>
    </div>
  );
};

export default LeaveManagement;
