import React from "react";
import { TimeSheetAction } from "../../../../actions/timeSheetAction";
import { TimeSheet, TimeSheetPayload } from "../../../../types/timeSheet";
import { UserDetailInformation } from "../../../../types/userTypes";
import { UserAction } from "../../../../actions/userAction";
import { SessionDate, TimeSheetStatus } from "../../../../constants/enum";
import { dateHelper, isWeekend } from "../../../../utils/datetime";
import dayjs from "dayjs";
import { Select } from "antd";
import { Session } from "../../../../constants/constantVariables";
import showNotification from "../../../../utils/notification";
import { BsCheckLg } from "react-icons/bs";

type Props = {
  date: string;
  userId: string;
  leaveDay: {
    isLeaveDay: boolean;
    context: string;
  };
};

const TimeSheetModal: React.FunctionComponent<Props> = (props: Props) => {
  const { date, userId, leaveDay } = props;
  const [user, setUser] = React.useState<UserDetailInformation>(
    {} as UserDetailInformation
  );
  const [timeSheets, setTimeSheets] = React.useState<TimeSheet[]>([]);
  const [isEditTimeSheet, setIsEditTimeSheet] = React.useState<boolean>(false);

  const [onSelectMorningStatus, setOnSelectMorningStatus] =
    React.useState<TimeSheetStatus>("" as TimeSheetStatus);

  const [onSelectAfternoonStatus, setOnSelectAfternoonStatus] =
    React.useState<TimeSheetStatus>("" as TimeSheetStatus);

  const [onSelectNightStatus, setOnSelectNightStatus] =
    React.useState<TimeSheetStatus>("" as TimeSheetStatus);

  const [isOvertime, setIsOvertime] = React.useState<boolean>(false);

  const [onSelectOvertimeStatus, setOnSelectOvertimeStatus] =
    React.useState<SessionDate>(SessionDate.Morning);

  const [isAddOvertime, setIsAddOvertime] = React.useState<boolean>(false);

  const statusOptions = [
    {
      label: TimeSheetStatus.Submitted,
      value: TimeSheetStatus.Submitted,
    },
    {
      label: TimeSheetStatus.Unsubmitted,
      value: TimeSheetStatus.Unsubmitted,
    },
    {
      label: TimeSheetStatus.LeaveWithoutRequest,
      value: TimeSheetStatus.LeaveWithoutRequest,
    },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      const timeSheets = await TimeSheetAction.getByDate(userId, date);
      const user = await UserAction.getUserInfo(userId);
      setTimeSheets(timeSheets ?? ([] as TimeSheet[]));
      setUser(user ?? ({} as UserDetailInformation));
      setOnSelectMorningStatus(
        (timeSheets?.find(
          (timeSheet) =>
            timeSheet.userId === user?.id &&
            timeSheet.session === SessionDate.Morning
        )?.status as TimeSheetStatus) ?? TimeSheetStatus.Unsubmitted
      );
      setOnSelectAfternoonStatus(
        (timeSheets?.find(
          (timeSheet) =>
            timeSheet.userId === user?.id &&
            timeSheet.session === SessionDate.Afternoon
        )?.status as TimeSheetStatus) ?? TimeSheetStatus.Unsubmitted
      );
      setOnSelectNightStatus(
        (timeSheets?.find(
          (timeSheet) =>
            timeSheet.userId === user?.id &&
            timeSheet.session === SessionDate.Night
        )?.status as TimeSheetStatus) ?? TimeSheetStatus.Unsubmitted
      );
    };

    fetchData();
  }, [date, userId]);

  const handleApply = async () => {
    const morningTimeSheet = timeSheets.find(
      (timeSheet) => timeSheet.session === SessionDate.Morning
    );

    const afternoonTimeSheet = timeSheets.find(
      (timeSheet) => timeSheet.session === SessionDate.Afternoon
    );

    const nightTimeSheet = timeSheets.find(
      (timeSheet) => timeSheet.session === SessionDate.Night
    );

    const morningTimeSheetData: TimeSheetPayload = {
      id: morningTimeSheet?.id ?? "",
      userId: userId,
      session: morningTimeSheet?.session ?? SessionDate.Morning,
      hoursWorked:
        onSelectMorningStatus === TimeSheetStatus.Submitted ||
        onSelectMorningStatus === TimeSheetStatus.Overtime
          ? 4
          : 0,
      timeIn:
        morningTimeSheet?.timeIn ??
        new Date().toLocaleTimeString("vi", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      date: date,
      status: onSelectMorningStatus,
      overtime: dateHelper.dateToString.isWeekend(date),
    };

    const afternoonTimeSheetData: TimeSheetPayload = {
      id: afternoonTimeSheet?.id ?? "",
      userId: userId,
      session: afternoonTimeSheet?.session ?? SessionDate.Afternoon,
      hoursWorked:
        onSelectAfternoonStatus === TimeSheetStatus.Submitted ? 4 : 0,
      timeIn:
        afternoonTimeSheet?.timeIn ??
        new Date().toLocaleTimeString("vi", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      date: date,
      status: onSelectAfternoonStatus,
      overtime: dateHelper.dateToString.isWeekend(date),
    };

    const nightTimeSheetData: TimeSheetPayload = {
      id: nightTimeSheet?.id ?? "",
      userId: userId,
      session: nightTimeSheet?.session ?? SessionDate.Night,
      hoursWorked:
        onSelectNightStatus === TimeSheetStatus.Submitted || isAddOvertime
          ? 4
          : 0,
      timeIn:
        nightTimeSheet?.timeIn ??
        new Date().toLocaleTimeString("vi", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      date: date,
      status: isAddOvertime ? TimeSheetStatus.Submitted : onSelectNightStatus,
      overtime: true,
    };

    if (
      isAddOvertime ||
      dateHelper.dateToString.isWeekend(date) ||
      nightTimeSheet?.id
    ) {
      await TimeSheetAction.updateByDate(userId, dayjs(date).toDate(), [
        morningTimeSheetData,
        afternoonTimeSheetData,
        nightTimeSheetData,
      ]);
    } else {
      await TimeSheetAction.updateByDate(userId, dayjs(date).toDate(), [
        morningTimeSheetData,
        afternoonTimeSheetData,
      ]);
    }
  };

  const handleAddOvertime = async () => {
    try {
      await TimeSheetAction.create({
        userId: userId,
        session: onSelectOvertimeStatus,
        hoursWorked: Session[onSelectOvertimeStatus] * 8,
        timeIn: new Date().toLocaleTimeString("vi", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        date: date,
        status: TimeSheetStatus.Submitted,
        overtime: true,
      });
    } catch (error) {
      showNotification("error", "Thêm thất bại! Vui lòng thử lại");
    }
  };

  const checkStatus = (
    timeSheet: TimeSheet,
    date: string,
    isLeaveDay: {
      isLeaveDay: boolean;
      context: string;
    }
  ) => {
    if (timeSheet.status === TimeSheetStatus.Submitted) {
      return {
        status: TimeSheetStatus.Submitted,
      };
    }

    if (!timeSheet.status) {
      if (
        dateHelper.dateToString.isBefore(
          date,
          dateHelper.dateToString.toString(new Date())
        )
      ) {
        return {
          status: TimeSheetStatus.LeaveWithoutRequest,
        };
      }

      if (isLeaveDay.isLeaveDay) {
        return {
          status: TimeSheetStatus.LeaveWithRequest,
        };
      }

      return {
        status: TimeSheetStatus.Unsubmitted,
      };
    }
  };

  if (isWeekend(dayjs(date).toDate())) {
    if (!timeSheets.length) {
      return (
        <div className="w-full p-4 flex flex-col gap-4">
          {!isOvertime ? (
            <div className="w-full p-4">
              <span className="font-bold text-xl text-gray-800">
                Không có tăng ca vào ngày nghỉ
              </span>
            </div>
          ) : (
            <div className="w-full flex flex-col">
              <div className="w-full p-4 flex justify-center items-center">
                <span className="font-bold text-xl text-gray-800">
                  Chọn thời gian tăng ca cuối tuần
                </span>
              </div>
              <div className="grid grid-cols-2 justify-center items-center">
                <span className="text-sm font-bold">Chọn ca:</span>
                <Select
                  className="w-full mr-1"
                  value={onSelectOvertimeStatus}
                  options={[
                    { value: SessionDate.Morning, label: "Sáng 8:00 -> 12:00" },
                    {
                      value: SessionDate.Afternoon,
                      label: "Chiều 13:30 -> 17:30",
                    },
                    { value: SessionDate.Night, label: "Tối 18:00 -> 22:00" },
                  ]}
                  onChange={(value) =>
                    setOnSelectOvertimeStatus(value as SessionDate)
                  }
                />
              </div>
            </div>
          )}
          <div className="w-full flex flex-row justify-end items-center gap-2">
            {isOvertime ? (
              <>
                <button
                  className="px-4 py-2 w-24 bg-red-500 hover:bg-red-600 rounded-md text-white font-bold text-sm"
                  onClick={() => setIsOvertime(false)}
                >
                  Hủy
                </button>
                <button
                  className="
        px-4 py-2 w-26 bg-green-500 hover:bg-green-600 rounded-md text-white font-bold text-sm
      "
                  onClick={handleAddOvertime}
                >
                  Cập nhật
                </button>
              </>
            ) : (
              <button
                className="
          px-4 py-2 w-26 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-bold text-sm
        "
                onClick={() => setIsOvertime(true)}
              >
                Thêm tăng ca
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full p-4 flex flex-col gap-4">
        <div className="w-full p-4 flex justify-center items-center">
          <span className="font-bold text-xl text-gray-800">
            Thông tin tăng ca cuối tuần
          </span>
        </div>
        <div className="w-full p-4 flex flex-col gap-4 border-2 border-gray-300 rounded-lg bg-white">
          <div className="grid grid-cols-2">
            <div className="flex justify-start">
              <span className="font-bold text-sm text-gray-700">
                Họ và tên:
              </span>
            </div>
            <div className="flex justify-start">
              <span className="text-sm text-gray-900">{user?.fullName}</span>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex justify-start">
              <span className="font-bold text-sm text-gray-700">
                Ngày công:
              </span>
            </div>
            <div className="flex justify-start">
              <span className="text-sm text-gray-900">{date}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 justify-center items-center">
            <div className="flex justify-start">
              <span className="font-bold text-sm text-gray-700">Ca sáng:</span>
            </div>
            <div className="w-[212px] flex flex-row justify-between items-center cursor-pointer">
              <Select
                className="w-full mr-1"
                disabled={!isEditTimeSheet}
                value={onSelectMorningStatus}
                defaultValue={
                  checkStatus(
                    timeSheets.find(
                      (timeSheet) => timeSheet.session === SessionDate.Morning
                    ) ?? ({} as TimeSheet),
                    date,
                    leaveDay
                  )?.status
                }
                options={[
                  {
                    label: TimeSheetStatus.Submitted,
                    value: TimeSheetStatus.Submitted,
                  },
                  {
                    label: TimeSheetStatus.Unsubmitted,
                    value: TimeSheetStatus.Unsubmitted,
                  },
                ]}
                onChange={(value) => setOnSelectMorningStatus(value)}
              />
              <span className="font-bold text-sm">
                {timeSheets.find(
                  (timeSheet) =>
                    timeSheet.userId === userId &&
                    timeSheet.session === SessionDate.Morning
                )?.timeIn || ""}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 justify-center items-center">
            <div className="flex justify-start">
              <span className="font-bold text-sm text-gray-700">Ca chiều:</span>
            </div>
            <div className="w-[212px] flex flex-row justify-between items-center cursor-pointer">
              <Select
                className="w-full mr-1"
                disabled={!isEditTimeSheet}
                value={onSelectAfternoonStatus}
                defaultValue={
                  checkStatus(
                    timeSheets.find(
                      (timeSheet) => timeSheet.session === SessionDate.Afternoon
                    ) ?? ({} as TimeSheet),
                    date,
                    leaveDay
                  )?.status
                }
                options={[
                  {
                    label: TimeSheetStatus.Submitted,
                    value: TimeSheetStatus.Submitted,
                  },
                  {
                    label: TimeSheetStatus.Unsubmitted,
                    value: TimeSheetStatus.Unsubmitted,
                  },
                ]}
                onChange={(value) => setOnSelectAfternoonStatus(value)}
              />
              <span className="font-bold text-sm">
                {timeSheets.find(
                  (timeSheet) =>
                    timeSheet.userId === userId &&
                    timeSheet.session === SessionDate.Afternoon
                )?.timeIn || ""}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 justify-center items-center">
            <div className="flex justify-start">
              <span className="font-bold text-sm text-gray-700">Ca tối:</span>
            </div>
            <div className="w-[212px] flex flex-row justify-between items-center cursor-pointer">
              <Select
                className="w-full mr-1"
                disabled={!isEditTimeSheet}
                value={onSelectNightStatus}
                defaultValue={
                  checkStatus(
                    timeSheets.find(
                      (timeSheet) => timeSheet.session === SessionDate.Night
                    ) ?? ({} as TimeSheet),
                    date,
                    leaveDay
                  )?.status
                }
                options={[
                  {
                    label: TimeSheetStatus.Submitted,
                    value: TimeSheetStatus.Submitted,
                  },
                  {
                    label: TimeSheetStatus.Unsubmitted,
                    value: TimeSheetStatus.Unsubmitted,
                  },
                ]}
                onChange={(value) => setOnSelectNightStatus(value)}
              />
              <span className="font-bold text-sm">
                {timeSheets.find(
                  (timeSheet) =>
                    timeSheet.userId === userId &&
                    timeSheet.session === SessionDate.Night
                )?.timeIn || ""}
              </span>
            </div>
          </div>
        </div>
        {isEditTimeSheet ? (
          <div className="w-full flex flex-row justify-end items-center gap-2">
            <button
              className="px-4 py-2 w-24 bg-red-500 hover:bg-red-600 rounded-md text-white font-bold text-sm"
              onClick={() => setIsEditTimeSheet(false)}
            >
              Hủy
            </button>
            <button
              className="
          px-4 py-2 w-26 bg-green-500 hover:bg-green-600 rounded-md text-white font-bold text-sm
        "
              onClick={handleApply}
            >
              Cập nhật
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-row justify-end items-center gap-2">
            <button
              className="
      px-4 py-2 w-26 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-bold text-sm
    "
              onClick={() => setIsEditTimeSheet(true)}
            >
              Chỉnh sửa
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full p-4 flex flex-col gap-4">
      <div className="w-full p-4 flex justify-center items-center">
        <span className="font-bold text-2xl text-gray-800">
          Thông tin chấm công
        </span>
      </div>
      <div className="w-full p-4 flex flex-col gap-4 border-2 border-gray-300 rounded-lg bg-white">
        <div className="grid grid-cols-2">
          <div className="flex justify-start">
            <span className="font-bold text-sm text-gray-700">Họ và tên:</span>
          </div>
          <div className="flex justify-start">
            <span className="text-sm text-gray-900">{user?.fullName}</span>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="flex justify-start">
            <span className="font-bold text-sm text-gray-700">Ngày công:</span>
          </div>
          <div className="flex justify-start">
            <span className="text-sm text-gray-900">{date}</span>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 justify-center items-center">
            <div className="flex justify-start">
              <span className="font-bold text-sm text-gray-700">Ca sáng:</span>
            </div>
            <div className="w-[212px] flex flex-row justify-between items-center cursor-pointer">
              <Select
                className="w-full mr-1"
                disabled={!isEditTimeSheet}
                value={onSelectMorningStatus}
                defaultValue={
                  checkStatus(
                    timeSheets.find(
                      (timeSheet) => timeSheet.session === SessionDate.Morning
                    ) ?? ({} as TimeSheet),
                    date,
                    leaveDay
                  )?.status
                }
                options={statusOptions}
                onChange={(value) => {
                  setOnSelectMorningStatus(value);
                }}
              />
              <span className="font-bold text-sm">
                {timeSheets.find(
                  (timeSheet) =>
                    timeSheet.userId === userId &&
                    timeSheet.session === SessionDate.Morning
                )?.timeIn || ""}
              </span>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 justify-center items-center">
            <div className="flex justify-start">
              <span className="font-bold text-sm text-gray-700">Ca chiều:</span>
            </div>
            <div className="w-[212px] flex flex-row justify-between items-center cursor-pointer">
              <Select
                className="w-full mr-1"
                disabled={!isEditTimeSheet}
                value={onSelectAfternoonStatus}
                defaultValue={
                  checkStatus(
                    timeSheets.find(
                      (timeSheet) => timeSheet.session === SessionDate.Afternoon
                    ) ?? ({} as TimeSheet),
                    date,
                    leaveDay
                  )?.status
                }
                options={statusOptions}
                onChange={(value) => {
                  setOnSelectAfternoonStatus(value);
                }}
              />
              <span className="font-bold text-sm">
                {timeSheets.find(
                  (timeSheet) =>
                    timeSheet.userId === userId &&
                    timeSheet.session === SessionDate.Afternoon
                )?.timeIn || ""}
              </span>
            </div>
          </div>
        </div>
        <div>
          {isEditTimeSheet &&
            !timeSheets.find(
              (timeSheet) => timeSheet.session === SessionDate.Night
            )?.overtime && (
              <div>
                <div className="flex justify-center items-center">
                  <div
                    className={`px-4 py-2 w-26 flex flex-row gap-2 ${
                      !isAddOvertime && `bg-blue-500 hover:bg-blue-600`
                    } ${
                      isAddOvertime && `bg-green-500 hover:bg-green-400`
                    } rounded-md 
             font-bold text-sm hover:cursor-pointer`}
                    onClick={() => {
                      if (isAddOvertime) {
                        setIsAddOvertime(false);
                      } else {
                        setIsAddOvertime(true);
                      }
                    }}
                  >
                    <span className="font-bold text-sm text-white">
                      Tăng ca tối
                    </span>
                    {isAddOvertime && (
                      <BsCheckLg className="text-white text-lg" />
                    )}
                  </div>
                </div>
              </div>
            )}
          {timeSheets.find(
            (timeSheet) => timeSheet.session === SessionDate.Night
          )?.overtime && (
            <div className="grid grid-cols-2 justify-center items-center">
              <div className="flex justify-start">
                <span className="font-bold text-sm text-gray-700">Ca tối:</span>
              </div>
              <div className="w-[212px] flex flex-row justify-between items-center cursor-pointer">
                <Select
                  className="w-full mr-1"
                  disabled={!isEditTimeSheet}
                  value={onSelectNightStatus}
                  defaultValue={
                    checkStatus(
                      timeSheets.find(
                        (timeSheet) => timeSheet.session === SessionDate.Night
                      ) ?? ({} as TimeSheet),
                      date,
                      leaveDay
                    )?.status
                  }
                  options={[
                    {
                      label: TimeSheetStatus.Submitted,
                      value: TimeSheetStatus.Submitted,
                    },
                    {
                      label: TimeSheetStatus.Unsubmitted,
                      value: TimeSheetStatus.Unsubmitted,
                    },
                  ]}
                  onChange={(value) => {
                    setOnSelectNightStatus(value);
                  }}
                />
                <span className="font-bold text-sm">
                  {timeSheets.find((timeSheet) => timeSheet.userId === userId)
                    ?.timeIn || ""}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {!leaveDay.isLeaveDay && (
        <div>
          {isEditTimeSheet ? (
            <div className="w-full flex flex-row justify-end items-center gap-2">
              <button
                className="px-4 py-2 w-24 bg-red-500 hover:bg-red-600 rounded-md text-white font-bold text-sm"
                onClick={() => setIsEditTimeSheet(false)}
              >
                Hủy
              </button>
              <button
                className="
          px-4 py-2 w-26 bg-green-500 hover:bg-green-600 rounded-md text-white font-bold text-sm
        "
                onClick={handleApply}
              >
                Cập nhật
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-row justify-end items-center gap-2">
              <button
                className="
      px-4 py-2 w-26 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-bold text-sm
    "
                onClick={() => setIsEditTimeSheet(true)}
              >
                Chỉnh sửa
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeSheetModal;
