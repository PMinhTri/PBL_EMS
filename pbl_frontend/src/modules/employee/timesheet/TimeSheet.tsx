import React from "react";
import MyTimeSheetStats from "./components/MyTimeSheetStats";
import CalendarTimeSheet from "./components/TimeSheetCalendar";

const TimeSheetPage: React.FunctionComponent = () => {
  return (
    <div className="p-2 w-full flex flex-col h-screen bg-slate-300 overflow-y-auto">
      <div className="flex flex-col gap-4 flex-grow">
        <div className="w-full flex flex-col bg-white rounded-md shadow-md p-4 gap-2">
          <div className="w-full flex justify-center items-center">
            <span className="uppercase text-2xl font-bold">Thống kê</span>
          </div>
          <MyTimeSheetStats />
        </div>
        <CalendarTimeSheet />
      </div>
      <footer className="bg-gray-200 mt-8 py-4 px-2 text-center text-gray-600"></footer>
    </div>
  );
};

export default TimeSheetPage;
