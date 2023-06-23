import React from "react";
import { RequestForm } from "./components/RequestForm";
import RequestHistory from "./components/RequestHistory";
import { useRecoilValue } from "recoil";
import userSelector from "../../../recoil/selectors/user";
import { Tabs } from "antd";
import Footer from "../../../components/Footer";

export const LeaveRequest: React.FunctionComponent = () => {
  const { userAuthInfo } = useRecoilValue(userSelector);
  const currentYear = new Date().getFullYear();

  const componentItems = [
    {
      component: <RequestForm />,
      key: "requestForm",
      value: "Yêu cầu nghỉ phép",
    },
    {
      component: <RequestHistory userId={userAuthInfo.id} year={currentYear} />,
      key: "requestHistory",
      value: "Lịch sử nghỉ phép",
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <div className="flex-grow p-6 overflow-y-auto">
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
      </div>
      <Footer />
    </div>
  );
};

export default LeaveRequest;
