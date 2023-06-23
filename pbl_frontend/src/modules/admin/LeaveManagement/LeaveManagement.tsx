import React from "react";
import LeaveBalanceManagement from "./components/LeaveBalanceManagement";
import LeaveRequestManagement from "./components/LeaveRequestManagement";
import { UserDetailInformation } from "../../../types/userTypes";
import { UserAction } from "../../../actions/userAction";
import { Tabs } from "antd";
import Footer from "../../../components/Footer";

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

  const componentItems = [
    {
      component: <LeaveRequestManagement employees={employeeList} />,
      key: "leaveRequestManagement",
      value: "Quản lý đơn xin nghỉ",
    },
    {
      component: <LeaveBalanceManagement employees={employeeList} />,
      key: "leaveBalanceManagement",
      value: "Quản lý số ngày nghỉ phép",
    },
  ];

  return (
    <div className="flex flex-col w-full h-screen overflow-auto p-4">
      <Tabs
        type="card"
        items={componentItems.map((item) => {
          const id = String(item.key);
          return {
            label: `${item.value}`,
            key: id,
            children: item.component,
          };
        })}
      />
      <Footer />
    </div>
  );
};

export default LeaveManagement;
