import React from "react";
import MyTimeSheetStats from "./components/MyTimeSheetStats";
import CalendarTimeSheet from "./components/TimeSheetCalendar";
import { useRecoilValue } from "recoil";
import userSelector from "../../../recoil/selectors/user";
import { LeaveRequest } from "../../../types/leaveTypes";
import { TimeSheetAction } from "../../../actions/timeSheetAction";
import { LeaveAction } from "../../../actions/leaveAction";

const TimeSheetPage: React.FunctionComponent = () => {
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [totalWorkload, setTotalWorkload] = React.useState<number>(0);
  const [overtimeWorkload, setOvertimeWorkload] = React.useState<number>(0);
  const { userAuthInfo } = useRecoilValue(userSelector);
  const [leaveRequest, setLeaveRequest] = React.useState<LeaveRequest[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      const workload = await TimeSheetAction.totalWorkload(
        userAuthInfo.id,
        month,
        year
      );

      setLeaveRequest(
        (await LeaveAction.getAllLeaveRequestByUserId(userAuthInfo.id)) ?? []
      );
      setOvertimeWorkload(
        await TimeSheetAction.getOvertimeWorkLoad(userAuthInfo.id, month, year)
      );

      setTotalWorkload(workload);
    };
    fetchData();
  }, [currentDate, userAuthInfo.id]);

  return (
    <div className="p-2 w-full flex flex-col h-screen bg-slate-300 overflow-y-auto">
      <div className="flex flex-col gap-4 flex-grow">
        <div className="w-full flex flex-col bg-white rounded-md shadow-md p-4 gap-2">
          <div className="w-full flex justify-center items-center">
            <span className="uppercase text-2xl font-bold">Thống kê</span>
          </div>
          <MyTimeSheetStats
            totalWorkload={totalWorkload}
            overtimeWorkload={overtimeWorkload}
            leaveRequest={leaveRequest}
          />
        </div>
        <CalendarTimeSheet />
      </div>
      <footer className="bg-gray-200 mt-8 py-4 px-2 text-center text-gray-600"></footer>
    </div>
  );
};

export default TimeSheetPage;
