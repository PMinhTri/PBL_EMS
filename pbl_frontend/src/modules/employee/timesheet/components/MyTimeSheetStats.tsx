import React from "react";
import { BsCalendar2Check, BsCalendarPlus, BsCalendarX } from "react-icons/bs";

const MyTimeSheetStats: React.FunctionComponent = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col w-full h-32 bg-white border shadow-md rounded-md">
        <span className="px-4 text-xl">Số ngày công:</span>
        <div className="w-full flex flex-row justify-between items-center py-8 px-4">
          <span className="text-2xl font-bold">10</span>
          <div className="text-xl text-green-600">
            <BsCalendar2Check />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full h-32 bg-white border shadow-md rounded-md">
        <span className="px-4 text-xl">Làm thêm giờ:</span>
        <div className="w-full flex flex-row justify-between items-center py-8 px-4">
          <span className="text-2xl font-bold">10</span>
          <div className="text-xl text-yellow-600">
            <BsCalendarPlus />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full h-32 bg-white border shadow-md rounded-md">
        <span className="px-4 text-xl">Số ngày nghỉ:</span>
        <div className="w-full flex flex-row justify-between items-center py-8 px-4">
          <span className="text-2xl font-bold">10</span>
          <div className="text-xl text-red-600">
            <BsCalendarX />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTimeSheetStats;
