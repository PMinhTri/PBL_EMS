import React from "react";
import { Calendar, Popover } from "antd";
import type { Dayjs } from "dayjs";
import type { CellRenderInfo } from "rc-picker/lib/interface";
import "moment/locale/vi";
import dayjs from "dayjs";
import showNotification from "../../../../utils/notification";
import { TimeSheetAction } from "../../../../actions/timeSheetAction";
import { useRecoilValue } from "recoil";
import userSelector from "../../../../recoil/selectors/user";
import { TimeSheet } from "../../../../types/timeSheet";
import { SessionDate } from "../../../../constants/enum";

type MorningPopoverProps = {
  date: Date;
  status?: string;
};

type AfternoonPopoverProps = {
  date: Date;
  status?: string;
};

const MorningPopover: React.FunctionComponent<MorningPopoverProps> = (
  props: MorningPopoverProps
) => {
  const { date, status } = props;
  const { userAuthInfo } = useRecoilValue(userSelector);

  const [currentTime, setCurrentTime] = React.useState<string>("");

  const handleCheckIn = async () => {
    const checkInDate = new Date();

    checkInDate.setHours(
      Number(currentTime.split(":")[0]),
      Number(currentTime.split(":")[1]),
      0
    ); // Set the date to the current time
    const deadlineEndTime = new Date();
    deadlineEndTime.setHours(12, 15, 0); // Set the deadline time to 12:15:00

    const deadlineStartTime = new Date();
    deadlineStartTime.setHours(7, 30, 0);
    if (
      !(
        dayjs(checkInDate).toDate() > deadlineStartTime &&
        dayjs(checkInDate).toDate() < deadlineEndTime
      )
    ) {
      // Time is over 12:15:00, show notification
      showNotification("error", "Không phải thời gian chấm công cho ca sáng");
      return;
    }

    if (
      !(
        dayjs(date).format("YYYY-MM-DD") ===
        dayjs(new Date()).format("YYYY-MM-DD")
      )
    ) {
      showNotification("error", "Không phải thời gian chấm công cho ca sáng");
      return;
    }

    try {
      await TimeSheetAction.create({
        userId: userAuthInfo?.id,
        session: SessionDate.Morning,
        hoursWorked: 4,
        status: "Đã chấm công",
        timeIn: currentTime,
        date: dayjs(date).format("YYYY-MM-DD"),
        overtime: false,
      });
      showNotification("success", "You have checked in successfully");
    } catch (error) {
      showNotification("error", "Chấm công thất bại! Vui lòng thử lại sau");
    }
  };

  React.useMemo(() => {
    const interval = setInterval(() => {
      const toDay = new Date();
      const hours = String(toDay.getHours()).padStart(2, "0");
      const minutes = String(toDay.getMinutes()).padStart(2, "0");
      const seconds = String(toDay.getSeconds()).padStart(2, "0");
      const time = `${hours}:${minutes}:${seconds}`;

      setCurrentTime(time);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-48 flex flex-col gap-2">
      <div className="w-full flex flex-col gap-2 justify-between px-2">
        <div className="w-full flex flex-row justify-between">
          <span>Ca sáng</span>
          <span>{dayjs(date).format("DD-MM-YYYY")}</span>
        </div>
        <div className="flex flex-row justify-center">
          <div className="flex flex-row justify-center">
            {status ? <span>Đã chấm công</span> : <span>{currentTime}</span>}
          </div>
        </div>
      </div>

      {!status && (
        <div>
          <button
            onClick={handleCheckIn}
            className="w-full h-8 bg-green-200 hover:bg-green-300 focus:bg-green-300 text-sm border rounded-sm"
          >
            Chấm công
          </button>
        </div>
      )}
    </div>
  );
};

const AfternoonPopover: React.FunctionComponent<AfternoonPopoverProps> = (
  props: AfternoonPopoverProps
) => {
  const { date, status } = props;
  const { userAuthInfo } = useRecoilValue(userSelector);

  const [currentTime, setCurrentTime] = React.useState<string>("");

  const handleCheckIn = async () => {
    const checkInDate = new Date();

    checkInDate.setHours(
      Number(currentTime.split(":")[0]),
      Number(currentTime.split(":")[1]),
      0
    ); // Set the date to the current time
    const deadlineTime = new Date();
    deadlineTime.setHours(17, 45, 0);

    if (dayjs(checkInDate).toDate() > deadlineTime) {
      showNotification("error", "Đã quá thời gian chấm công cho ca chiều");
      return;
    }

    deadlineTime.setHours(12, 30, 0);
    if (dayjs(checkInDate).toDate() < deadlineTime) {
      showNotification("error", "Chưa đến thời gian chấm công cho ca chiều");
      return;
    }

    if (
      !(
        dayjs(date).format("YYYY-MM-DD") ===
        dayjs(new Date()).format("YYYY-MM-DD")
      )
    ) {
      showNotification("error", "Chưa đến thời gian chấm công cho ca chiều");
      return;
    }

    try {
      await TimeSheetAction.create({
        userId: userAuthInfo?.id,
        session: "chiều",
        hoursWorked: 4,
        status: "Đã chấm công",
        timeIn: currentTime,
        date: dayjs(date).format("YYYY-MM-DD"),
        overtime: false,
      });
      showNotification("success", "Bạn đã thực hiện chấm công thành công!");
    } catch (error) {
      showNotification("error", "Chấm công thất bại! Vui lòng thử lại sau");
    }
  };

  React.useMemo(() => {
    const interval = setInterval(() => {
      const toDay = new Date();
      const hours = String(toDay.getHours()).padStart(2, "0");
      const minutes = String(toDay.getMinutes()).padStart(2, "0");
      const seconds = String(toDay.getSeconds()).padStart(2, "0");
      const time = `${hours}:${minutes}:${seconds}`;

      setCurrentTime(time);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-48 flex flex-col gap-2">
      <div className="w-full flex flex-col gap-2 justify-between px-2">
        <div className="w-full flex flex-row justify-between">
          <span>Ca chiều</span>
          <span>{dayjs(date).format("DD-MM-YYYY")}</span>
        </div>
        <div className="flex flex-row justify-center">
          {status ? <span>Đã chấm công</span> : <span>{currentTime}</span>}
        </div>
      </div>

      {!status && (
        <div>
          <button
            onClick={handleCheckIn}
            className="w-full h-8 bg-green-200 hover:bg-green-300 focus:bg-green-300 text-sm border rounded-sm"
          >
            Chấm công
          </button>
        </div>
      )}
    </div>
  );
};

type Props = {
  onSelect: (value: Dayjs) => void;
};

const CalendarContainer: React.FunctionComponent<Props> = (props: Props) => {
  const { onSelect } = props;

  const [timeSheet, setTimeSheet] = React.useState<TimeSheet[]>([]);
  const [arrMorning, setArrMorning] = React.useState<string[]>([]);
  const [arrAfternoon, setArrAfternoon] = React.useState<string[]>([]);

  const [currentDate, setCurrentDate] = React.useState<Dayjs>(dayjs());

  const { userAuthInfo } = useRecoilValue(userSelector);

  React.useEffect(() => {
    const fetchData = async () => {
      const timeSheets = await TimeSheetAction.getByUser(
        userAuthInfo?.id,
        currentDate.month() + 1,
        currentDate.year()
      );

      setTimeSheet(timeSheets);

      setArrMorning(
        timeSheets
          .filter((timeSheet) => timeSheet.session === SessionDate.Morning)
          .map(
            (timeSheet) =>
              `${timeSheet.date}-${timeSheet.month}-${timeSheet.year}`
          )
      );

      setArrAfternoon(
        timeSheets
          .filter((timeSheet) => timeSheet.session === "chiều")
          .map(
            (timeSheet) =>
              `${timeSheet.date}-${timeSheet.month}-${timeSheet.year}`
          )
      );
    };

    fetchData();
  }, [currentDate, timeSheet, userAuthInfo?.id]);

  const getDataForDay = (value: Dayjs) => {
    if (value.day() === 0 || value.day() === 6) {
      return [];
    }

    const data = [
      {
        content: (
          <>
            <Popover
              placement="top"
              content={
                <MorningPopover
                  date={value.toDate()}
                  status={
                    timeSheet.find(
                      (item) =>
                        `${item.date}-${item.month}-${item.year}` ===
                          `${value.date()}-${
                            value.month() + 1
                          }-${value.year()}` &&
                        item.session === SessionDate.Morning
                    )?.status
                  }
                />
              }
              trigger={"click"}
            >
              <div
                className={`w-full flex flex-col h-10 justify-center items-center ${
                  arrMorning.includes(
                    `${value.date()}-${value.month() + 1}-${value.year()}`
                  )
                    ? `bg-green-200 hover:bg-green-300 focus:bg-green-300`
                    : `bg-slate-200 hover:bg-slate-300 focus:bg-slate-300`
                } text-sm border rounded-sm`}
              >
                <div className="w-full flex flex-row justify-between px-2">
                  <span>Ca sáng</span>
                </div>
                {timeSheet.find(
                  (item) =>
                    `${item.date}-${item.month}-${item.year}` ===
                      `${value.date()}-${value.month() + 1}-${value.year()}` &&
                    item.session === SessionDate.Morning
                ) && (
                  <div
                    className="
                  w-full flex flex-row justify-between px-2 text-xs
                  "
                  >
                    <span>Chấm công lúc</span>
                    {
                      timeSheet.find(
                        (item) =>
                          `${item.date}-${item.month}-${item.year}` ===
                            `${value.date()}-${
                              value.month() + 1
                            }-${value.year()}` &&
                          item.session === SessionDate.Morning
                      )?.timeIn
                    }
                  </div>
                )}
              </div>
            </Popover>
            <Popover
              placement="top"
              content={
                <AfternoonPopover
                  date={value.toDate()}
                  status={
                    timeSheet.find(
                      (item) =>
                        `${item.date}-${item.month}-${item.year}` ===
                          `${value.date()}-${
                            value.month() + 1
                          }-${value.year()}` && item.session === "chiều"
                    )?.status
                  }
                />
              }
              trigger={"click"}
            >
              <div
                className={`w-full flex flex-col h-10 justify-center items-center ${
                  arrAfternoon.includes(
                    `${value.date()}-${value.month() + 1}-${value.year()}`
                  )
                    ? `bg-green-200 hover:bg-green-300 focus:bg-green-300`
                    : `bg-slate-200 hover:bg-slate-300 focus:bg-slate-300`
                } text-sm border rounded-sm `}
              >
                <div className="w-full flex flex-row justify-between px-2">
                  <span>Ca chiều</span>
                </div>
                {timeSheet.find(
                  (item) =>
                    `${item.date}-${item.month}-${item.year}` ===
                      `${value.date()}-${value.month() + 1}-${value.year()}` &&
                    item.session === "chiều"
                ) && (
                  <div
                    className="
                  w-full flex flex-row justify-between px-2 text-xs
                  "
                  >
                    <span>Chấm công lúc</span>
                    {
                      timeSheet.find(
                        (item) =>
                          `${item.date}-${item.month}-${item.year}` ===
                            `${value.date()}-${
                              value.month() + 1
                            }-${value.year()}` && item.session === "chiều"
                      )?.timeIn
                    }
                  </div>
                )}
              </div>
            </Popover>
          </>
        ),
      },
    ];

    return data;
  };

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
      className="border-[2px]"
      onSelect={(value) => {
        setCurrentDate(value);
        onSelect(value);
      }}
      cellRender={cellRender}
      mode="month"
    />
  );
};

export default CalendarContainer;
