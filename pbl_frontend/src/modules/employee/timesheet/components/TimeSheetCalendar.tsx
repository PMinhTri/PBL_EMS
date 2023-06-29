import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import { dateHelper, isWeekend, renderEvent } from "../../../../utils/datetime";
import { EventInput } from "@fullcalendar/core/index.js";
import { Modal, Popover } from "antd";
import TimeSheetModal from "./TimeSheetModal";
import { SessionDate, TimeSheetStatus } from "../../../../constants/enum";
import { TimeSheetAction } from "../../../../actions/timeSheetAction";
import { useRecoilValue } from "recoil";
import userSelector from "../../../../recoil/selectors/user";
import { Session } from "../../../../constants/constantVariables";
import showNotification from "../../../../utils/notification";
import dayjs from "dayjs";

const CalendarTimeSheet: React.FunctionComponent = () => {
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [isOpenModal, setIsOpenModal] = React.useState<{
    isOpen: boolean;
    date: string;
  }>({
    isOpen: false,
    date: dayjs(new Date()).format("YYYY-MM-DD"),
  });
  const { userAuthInfo } = useRecoilValue(userSelector);
  const [session, setSession] = React.useState<SessionDate>(
    SessionDate.Morning
  );
  const calendarRef = React.useRef<FullCalendar>(null);
  const [timeSheetEvents, setTimeSheetEvents] = React.useState<EventInput[]>(
    []
  );

  React.useEffect(() => {
    const fetchData = async () => {
      const timeSheets = await TimeSheetAction.getByUser(
        userAuthInfo?.id as string,
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
      );

      setTimeSheetEvents(renderEvent(currentDate.getFullYear(), timeSheets));
    };

    fetchData();
  }, [currentDate, userAuthInfo?.id]);

  const eventRender = (info: EventInput) => {
    const { event } = info;
    const startTime = event.start?.toLocaleTimeString("vi", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = event.end?.toLocaleTimeString("vi", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const timeSheetStatus = event.extendedProps?.status as string;
    const timeIn = event.extendedProps?.timeIn as string;
    const overTime = event.extendedProps?.overTime as boolean;

    return (
      <Popover
        trigger={"click"}
        placement={"top"}
        content={
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold">{event.title}</span>
            <span className="text-xs">
              {startTime} - {endTime}
            </span>
          </div>
        }
      >
        {" "}
        <div
          className={`w-[170px] h-full flex flex-col gap-1 border-l-[3px] px-2 rounded-sm ${
            !overTime &&
            timeSheetStatus === TimeSheetStatus.Submitted &&
            ` bg-green-200 border-green-600`
          } ${
            timeSheetStatus === TimeSheetStatus.Unsubmitted &&
            ` bg-slate-200 border-slate-600`
          }
          ${
            timeSheetStatus === TimeSheetStatus.LeaveWithoutRequest &&
            ` bg-red-200 border-red-600`
          }
          ${
            timeSheetStatus === TimeSheetStatus.LeaveWithRequest &&
            ` bg-yellow-200 border-yellow-600`
          }
          ${
            overTime &&
            timeSheetStatus === TimeSheetStatus.Submitted &&
            ` bg-blue-200 border-blue-600`
          }
          `}
        >
          <div className="w-full flex flex-row justify-between items-center">
            <span className={`text-sm font-bold text-slate-600`}>
              {event.title}
            </span>
            <span className={`text-sx text-slate-600`}>
              {startTime} - {endTime}
            </span>
          </div>
          <div className="w-full flex flex-row justify-between items-center">
            <span className="text-xs text-slate-600">
              {timeSheetStatus === TimeSheetStatus.Submitted && `Đã chấm công:`}
              {timeSheetStatus === TimeSheetStatus.Unsubmitted &&
                `Chưa chấm công`}
              {timeSheetStatus === TimeSheetStatus.LeaveWithoutRequest &&
                `Nghỉ không phép`}
              {timeSheetStatus === TimeSheetStatus.LeaveWithRequest &&
                `Nghỉ có phép`}
            </span>
            <span className="text-xs text-slate-600">
              {timeSheetStatus === TimeSheetStatus.Submitted ? timeIn : ""}
            </span>
          </div>
        </div>
      </Popover>
    );
  };

  const handleNextButtonClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    const nextMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
    setCurrentDate(nextMonthDate);
    calendarApi?.gotoDate(nextMonthDate);
  };

  const handlePrevButtonClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    const prevMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    setCurrentDate(prevMonthDate);
    calendarApi?.gotoDate(prevMonthDate);
  };

  const handleTodayButtonClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    const today = new Date();
    setCurrentDate(today);
    calendarApi?.gotoDate(today);
  };

  const handleCheckInButtonClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    const today = new Date();
    setCurrentDate(today);
    calendarApi?.gotoDate(today);
    setIsOpenModal({
      isOpen: true,
      date: dayjs(new Date()).format("YYYY-MM-DD"),
    });
  };

  const handleCheckIn = async () => {
    const checkInDate = new Date();

    const dateString = checkInDate.toISOString().split("T")[0];
    const checkInTime = checkInDate.toLocaleTimeString("vi", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    if (dayjs(checkInDate).isBefore(new Date())) return;

    if (dayjs(checkInDate).isAfter(new Date())) {
      showNotification("warning", "Chưa đến thời gian chấm công!");
      return;
    }

    if (session === SessionDate.Morning) {
      const checkInRange1Start = new Date(checkInDate);
      checkInRange1Start.setHours(8, 0, 0); // Set start time for range 1 (8:00)

      const checkInRange1End = new Date(checkInDate);
      checkInRange1End.setHours(12, 0, 0); // Set end time for range 1 (12:00)

      if (
        !(checkInDate >= checkInRange1Start && checkInDate <= checkInRange1End)
      ) {
        showNotification(
          "error",
          "Thời gian chấm công cho buổi sáng từ 8:00 đến 12:00!"
        );
        return;
      }
    }

    if (session === SessionDate.Afternoon) {
      const checkInRange2Start = new Date(checkInDate);
      checkInRange2Start.setHours(13, 0, 0); // Set start time for range 2 (13:00)

      const checkInRange2End = new Date(checkInDate);
      checkInRange2End.setHours(17, 30, 0); // Set end time for range 2 (17:30)

      if (
        !(checkInDate >= checkInRange2Start && checkInDate <= checkInRange2End)
      ) {
        showNotification(
          "error",
          "Thời gian chấm công cho buổi chiều từ 13:00 đến 17:30!"
        );
        return;
      }
    }

    if (session === SessionDate.Night) {
      const checkInRange3Start = new Date(checkInDate);
      checkInRange3Start.setHours(18, 0, 0); // Set start time for range 3 (18:00)

      const checkInRange3End = new Date(checkInDate);
      checkInRange3End.setHours(22, 0, 0); // Set end time for range 3 (22:30)

      if (
        !(checkInDate >= checkInRange3Start && checkInDate <= checkInRange3End)
      ) {
        showNotification(
          "error",
          `Thời gian chấm công cho buổi tối từ 18:00 đến 22:00!`
        );
        return;
      }
    }

    try {
      isWeekend(checkInDate) || session === SessionDate.Night
        ? await TimeSheetAction.create({
            userId: userAuthInfo?.id,
            session: session,
            hoursWorked: Session[session] * 8,
            status: TimeSheetStatus.Submitted,
            timeIn: checkInTime,
            date: dateString,
            overtime: true,
          })
        : await TimeSheetAction.create({
            userId: userAuthInfo?.id,
            session: session,
            hoursWorked: Session[session] * 8,
            status: TimeSheetStatus.Submitted,
            timeIn: checkInTime,
            date: dateString,
            overtime: false,
          });
    } catch (error) {
      showNotification("error", "Chấm công thất bại! Vui lòng thử lại sau");
    }
  };

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="w-full flex flex-row justify-center items-center mb-2">
        <span className="text-lg font-bold">Lịch chấm công</span>
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[interactionPlugin, dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "checkIn",
          center: "title",
          right: "today prevMonth,nextMonth",
        }}
        locale={viLocale}
        events={timeSheetEvents}
        eventContent={eventRender}
        eventClassNames={
          "flex border-none bg-transparent outline-none hover:bg-transparent !important"
        }
        selectable={true}
        select={(info) => {
          setIsOpenModal({
            isOpen: true,
            date: dayjs(info.start).format("YYYY-MM-DD"),
          });
        }}
        customButtons={{
          nextMonth: {
            icon: "chevron-right",
            click: handleNextButtonClick,
          },
          prevMonth: {
            icon: "chevron-left",
            click: handlePrevButtonClick,
          },
          today: {
            text: "Hôm nay",
            click: handleTodayButtonClick,
          },
          checkIn: {
            text: "Chấm công",
            click: handleCheckInButtonClick,
          },
        }}
      />
      <Modal
        open={isOpenModal.isOpen}
        onCancel={() => {
          setIsOpenModal({
            isOpen: false,
            date: dayjs(new Date()).format("YYYY-MM-DD"),
          });
          setSession(SessionDate.Morning);
        }}
        destroyOnClose={true}
        footer={
          <div className="w-full grid grid-cols-2 gap-1">
            <div></div>
            <div className="w-full flex flex-row gap-1">
              {dateHelper.dateToString.isSame(
                isOpenModal.date,
                dateHelper.dateToString.toString(new Date())
              ) && (
                <button
                  className={`flex-1 p-2 rounded-md text-white bg-green-500 hover:bg-green-600`}
                  onClick={handleCheckIn}
                >
                  Chấm công
                </button>
              )}
            </div>
          </div>
        }
      >
        <TimeSheetModal
          timeCheckIn={isOpenModal.date}
          session={session}
          onSelectSession={setSession}
        />
      </Modal>
    </div>
  );
};

export default CalendarTimeSheet;
