import React from "react";
import { Calendar } from "antd";
import type { Dayjs } from "dayjs";
import type { CellRenderInfo } from "rc-picker/lib/interface";
import "moment/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";

const getDataForDay = (value: Dayjs) => {
  if (value.day() === 0 || value.day() === 6) {
    return [];
  }
  const arrMorning = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
  const arrAfternoon = [8, 9, 15, 29];

  const data = [
    {
      content: (
        <>
          <div
            onClick={() => {
              if (arrMorning.includes(value.date())) {
                console.log("sáng");
              }
            }}
            className={`w-full flex flex-col h-10 justify-center items-center ${
              arrMorning.includes(value.date())
                ? `bg-slate-200 hover:bg-slate-300 focus:bg-slate-300`
                : `bg-green-200 hover:bg-green-300 focus:bg-green-300`
            } text-sm border rounded-sm`}
          >
            <div className="w-full flex flex-row justify-between px-2">
              <span>Ca sáng</span>
            </div>
            <span>8:00-12:00</span>
          </div>
          <div
            onClick={() => {
              if (arrAfternoon.includes(value.date())) {
                console.log("sáng");
              }
            }}
            className={`w-full flex flex-col h-10 justify-center items-center ${
              arrAfternoon.includes(value.date())
                ? `bg-slate-200 hover:bg-slate-300 focus:bg-slate-300`
                : `bg-green-200 hover:bg-green-300 focus:bg-green-300`
            } text-sm border rounded-sm `}
          >
            <div className="w-full flex flex-row justify-between px-2">
              <span>Ca chiều</span>
            </div>
            <span>13:30-17:30</span>
          </div>
        </>
      ),
    },
  ];

  return data;
};

const CalendarContainer: React.FunctionComponent = () => {
  const dateCellRender = (value: Dayjs) => {
    const listData = getDataForDay(value);
    return (
      <div className="events">
        {listData.map((item, index) => (
          <div key={index} className="flex flex-col w-full gap-1">
            {item.content}
          </div>
        ))}
      </div>
    );
  };

  const cellRender = (current: Dayjs, info: CellRenderInfo<Dayjs>) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return (
    <Calendar
      locale={locale}
      className="border-[2px]"
      cellRender={cellRender}
    />
  );
};

export default CalendarContainer;
