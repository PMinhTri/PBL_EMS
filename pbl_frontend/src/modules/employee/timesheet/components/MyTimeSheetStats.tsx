import React from "react";
import {
  BsCalendar2Check,
  BsCalendar4Week,
  BsCalendarPlus,
  BsCalendarX,
} from "react-icons/bs";
import { LeaveRequest } from "../../../../types/leaveTypes";
import { dateHelper, getDates } from "../../../../utils/datetime";
import dayjs from "dayjs";
import { useRecoilValue } from "recoil";
import userSelector from "../../../../recoil/selectors/user";
import { TimeSheetAction } from "../../../../actions/timeSheetAction";
import { LeaveAction } from "../../../../actions/leaveAction";
import { TimeSheet } from "../../../../types/timeSheet";

const currentYears = Array.from(Array(10).keys()).map(
  (item) => new Date().getFullYear() - item
);

const MyTimeSheetStats: React.FunctionComponent = () => {
  const [selectedYear, setSelectedYear] = React.useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = React.useState<number>(
    new Date().getMonth() + 1
  );
  const [totalWorkload, setTotalWorkload] = React.useState<number>(0);
  const [todayTimeSheet, setTodayTimeSheet] = React.useState<TimeSheet[]>([]);
  const [overtimeWorkload, setOvertimeWorkload] = React.useState<number>(0);
  const { userAuthInfo } = useRecoilValue(userSelector);
  const [leaveRequest, setLeaveRequest] = React.useState<LeaveRequest[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const workload = await TimeSheetAction.getTotalWorkload(
        userAuthInfo.id,
        selectedMonth,
        selectedYear
      );

      setLeaveRequest(
        (await LeaveAction.getAllLeaveRequestByUserId(
          userAuthInfo.id,
          selectedMonth,
          selectedYear
        )) ?? []
      );
      setOvertimeWorkload(
        await TimeSheetAction.getOvertimeWorkLoad(
          userAuthInfo.id,
          selectedMonth,
          selectedYear
        )
      );
      setTotalWorkload(workload);
      setTodayTimeSheet(
        (await TimeSheetAction.getByDate(
          userAuthInfo.id,
          dateHelper.dateToString.toString(new Date())
        )) ?? []
      );
    };
    fetchData();
  }, [selectedMonth, selectedYear, userAuthInfo.id]);

  const monthOptions = (year: number) => {
    if (year === new Date().getFullYear()) {
      return Array.from(Array(new Date().getMonth() + 1).keys()).map(
        (item) => item + 1
      );
    }

    return Array.from(Array(12).keys()).map((item) => item + 1);
  };

  const getLeaveWithoutRequestDate = (
    leaveRequest: LeaveRequest[],
    startDate: Date,
    endDate: Date
  ) => {
    if (
      dayjs(
        `${startDate.getFullYear()}-${
          startDate.getMonth() + 1
        }-${startDate.getDate()}`
      ).isAfter(dayjs())
    ) {
      return 0;
    }

    if (selectedMonth !== new Date().getMonth() + 1) {
      return (
        getDates(startDate, endDate, true).length -
        leaveRequest.length -
        totalWorkload
      );
    }

    return (
      getDates(startDate, endDate, true).length -
      leaveRequest.length -
      totalWorkload -
      todayTimeSheet.reduce((acc, item) => {
        return acc + item.hoursWorked;
      }, 0) /
        8
    );
  };

  return (
    <div className="w-full">
      <div className="w-full flex flex-row items-start mb-2">
        <div>
          <label className="mx-2">Năm:</label>
          <select
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={selectedYear}
            onChange={(event) => {
              setSelectedYear(parseInt(event.target.value));
            }}
          >
            {currentYears.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mx-2">Tháng:</label>
          <select
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(parseInt(event.target.value))}
          >
            {monthOptions(selectedYear).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
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
            <span className="text-2xl font-bold">
              {getLeaveWithoutRequestDate(
                leaveRequest,
                new Date(selectedYear, selectedMonth - 1, 1),
                new Date(selectedYear, selectedMonth, 0)
              )}
            </span>
            <div className="text-2xl text-red-600">
              <BsCalendarX />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTimeSheetStats;
