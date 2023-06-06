import React from "react";
import MyTimeSheetStats from "./components/MyTimeSheetStats";
import CalendarContainer from "./components/CalendarContainer";
import dayjs, { Dayjs } from "dayjs";

const TimeSheetPage: React.FunctionComponent = () => {
  const [currentDate, setCurrentDate] = React.useState<Dayjs>(dayjs());
  return (
    <div className="p-2 w-full flex flex-col h-screen bg-slate-300 overflow-y-auto">
      <div className="flex flex-col gap-4 flex-grow">
        <div className="flex flex-row justify-around">
          <span className="font-bold text-2xl">Chấm công</span>
        </div>
        <CalendarContainer onSelect={(value) => setCurrentDate(value)} />
        <MyTimeSheetStats
          month={currentDate.month() + 1}
          year={currentDate.year()}
        />
      </div>
      <footer className="bg-gray-200 mt-8 py-4 px-2 text-center text-gray-600"></footer>
    </div>
  );
};

export default TimeSheetPage;
