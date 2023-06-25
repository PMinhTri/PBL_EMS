import React from "react";
import {
  BsCalendar2Check,
  BsCalendar4Week,
  BsCalendarPlus,
  BsCalendarX,
} from "react-icons/bs";
import { LeaveRequest } from "../../../../types/leaveTypes";

type Props = {
  totalWorkload: number;
  overtimeWorkload: number;
  leaveRequest: LeaveRequest[];
};

const MyTimeSheetStats: React.FunctionComponent<Props> = (props: Props) => {
  const { totalWorkload, overtimeWorkload, leaveRequest } = props;
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
