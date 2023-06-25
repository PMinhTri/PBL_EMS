import React from "react";
import {
  BsCalendar2Check,
  BsCalendar4Week,
  BsCalendarPlus,
  BsCalendarX,
} from "react-icons/bs";
import { TimeSheetAction } from "../../../../actions/timeSheetAction";
import { useRecoilValue } from "recoil";
import userSelector from "../../../../recoil/selectors/user";
import { LeaveRequest } from "../../../../types/leaveTypes";
import { LeaveAction } from "../../../../actions/leaveAction";

const MyTimeSheetStats: React.FunctionComponent = () => {
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
    <div className="grid grid-cols-4 gap-4">
      <div className="flex flex-col w-full h-32 bg-white border shadow-md rounded-md">
        <h5 className="text-blueGray-400 uppercase p-4 font-bold text-ls">
          Số ngày công
        </h5>
        <div className="w-full flex flex-row justify-between items-center px-4">
          <span className="text-2xl font-bold">{totalWorkload}</span>
          <div className="text-2xl text-green-600">
            <BsCalendar2Check />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full h-32 bg-white border shadow-md rounded-md">
        <h5 className="text-blueGray-400 uppercase p-4 font-bold text-ls">
          Tăng ca
        </h5>
        <div className="w-full flex flex-row justify-between items-center px-4">
          <span className="text-2xl font-bold">{overtimeWorkload}</span>
          <div className="text-2xl text-blue-600">
            <BsCalendarPlus />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full h-32 bg-white border shadow-md rounded-md">
        <h5 className="text-blueGray-400 uppercase p-4 font-bold text-ls">
          Số ngày nghỉ có phép
        </h5>
        <div className="w-full flex flex-row justify-between items-center px-4">
          <span className="text-2xl font-bold">
            {leaveRequest
              .filter((item) => item.status === "APPROVED")
              .reduce((acc, item) => {
                return acc + item.leaveDays;
              }, 0)}
          </span>
          <div className="text-2xl text-yellow-600">
            <BsCalendar4Week />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full h-32 bg-white border shadow-md rounded-md">
        <h5 className="text-blueGray-400 uppercase p-4 font-bold text-ls">
          Số ngày nghỉ không phép
        </h5>
        <div className="w-full flex flex-row justify-between items-center px-4">
          <span className="text-2xl font-bold">0</span>
          <div className="text-2xl text-red-600">
            <BsCalendarX />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTimeSheetStats;
