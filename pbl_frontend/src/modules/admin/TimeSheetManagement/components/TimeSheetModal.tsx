import React from "react";
import { TimeSheetAction } from "../../../../actions/timeSheetAction";
import { TimeSheet, TimeSheetPayload } from "../../../../types/timeSheet";
import { UserDetailInformation } from "../../../../types/userTypes";
import { UserAction } from "../../../../actions/userAction";
import { SessionDate, TimeSheetStatus } from "../../../../constants/enum";
import { dateHelper, isWeekend } from "../../../../utils/datetime";
import dayjs from "dayjs";
import { Select } from "antd";

type Props = {
  date: string;
  userId: string;
  leaveDay: {
    isLeaveDay: boolean;
    context: string;
  };
  onClose: () => void;
};

const TimeSheetModal: React.FunctionComponent<Props> = (props: Props) => {
  const { date, userId, leaveDay, onClose } = props;
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
    {
      label: TimeSheetStatus.Overtime,
      value: TimeSheetStatus.Overtime,
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
    };

    const afternoonTimeSheetData: TimeSheetPayload = {
      id: afternoonTimeSheet?.id ?? "",
      userId: userId,
      session: afternoonTimeSheet?.session ?? SessionDate.Afternoon,
      hoursWorked:
        onSelectAfternoonStatus === TimeSheetStatus.Submitted ||
        onSelectAfternoonStatus === TimeSheetStatus.Overtime
          ? 4
          : 0,
      timeIn:
        afternoonTimeSheet?.timeIn ??
        new Date().toLocaleTimeString("vi", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      date: date,
      status: onSelectAfternoonStatus,
    };

    const nightTimeSheetData: TimeSheetPayload = {
      id: nightTimeSheet?.id ?? "",
      userId: userId,
      session: nightTimeSheet?.session ?? SessionDate.Night,
      hoursWorked:
        onSelectNightStatus === TimeSheetStatus.Submitted ||
        onSelectNightStatus === TimeSheetStatus.Overtime
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
      status: onSelectNightStatus,
    };

    await TimeSheetAction.updateByDate(userId, dayjs(date).toDate(), [
      morningTimeSheetData,
      afternoonTimeSheetData,
      nightTimeSheetData,
    ]);
  };

  const checkStatus = (
    timeSheet: TimeSheet,
    date: string,
    isLeaveDay: {
      isLeaveDay: boolean;
      context: string;
    }
  ) => {
    if (timeSheet.status === TimeSheetStatus.Submitted && !timeSheet.overtime) {
      return {
        status: TimeSheetStatus.Submitted,
      };
    }

    if (timeSheet.status === TimeSheetStatus.Submitted && timeSheet.overtime) {
      return {
        status: TimeSheetStatus.Overtime,
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
          <div className="w-full p-4">
            <span className="font-bold text-xl text-gray-800">
              Không có tăng ca vào ngày nghỉ
            </span>
          </div>
          <div className="w-full flex flex-row justify-end items-center gap-2">
            <button
              className="px-4 py-2 w-24 bg-gray-200 hover:bg-gray-400 rounded-md text-gray-700 font-bold text-sm"
              onClick={onClose}
            >
              Đóng
            </button>
            <button
              className="
          px-4 py-2 w-26 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-bold text-sm
        "
            >
              Thêm tăng ca
            </button>
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
          {timeSheets.find(
            (timeSheet) => timeSheet.session === SessionDate.Morning
          )?.overtime && (
            <div className="grid grid-cols-2 justify-center items-center">
              <div className="flex justify-start">
                <span className="font-bold text-sm text-gray-700">
                  Ca sáng:
                </span>
              </div>
              <div className="w-[152px] flex flex-row justify-between items-center cursor-pointer">
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
          )}
          {timeSheets.find(
            (timeSheet) => timeSheet.session === SessionDate.Afternoon
          )?.overtime && (
            <div className="grid grid-cols-2 justify-center items-center">
              <div className="flex justify-start">
                <span className="font-bold text-sm text-gray-700">
                  Ca chiều:
                </span>
              </div>
              <div className="w-[152px] flex flex-row justify-between items-center cursor-pointer">
                <Select
                  className="w-full mr-1"
                  disabled={!isEditTimeSheet}
                  value={
                    checkStatus(
                      timeSheets.find(
                        (timeSheet) =>
                          timeSheet.session === SessionDate.Afternoon
                      ) ?? ({} as TimeSheet),
                      date,
                      leaveDay
                    )?.status
                  }
                  options={statusOptions}
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
          )}
          {timeSheets.find(
            (timeSheet) => timeSheet.session === SessionDate.Night
          )?.overtime && (
            <div className="grid grid-cols-2 justify-center items-center">
              <div className="flex justify-start">
                <span className="font-bold text-sm text-gray-700">Ca tối:</span>
              </div>
              <div className="w-[152px] flex flex-row justify-between items-center cursor-pointer">
                <Select
                  className="w-full mr-1"
                  disabled={!isEditTimeSheet}
                  value={
                    checkStatus(
                      timeSheets.find(
                        (timeSheet) => timeSheet.session === SessionDate.Night
                      ) ?? ({} as TimeSheet),
                      date,
                      leaveDay
                    )?.status
                  }
                  options={statusOptions}
                  onChange={(value) => setOnSelectNightStatus(value)}
                />
                <span className="font-bold text-sm">
                  {timeSheets.find((timeSheet) => timeSheet.userId === userId)
                    ?.timeIn || ""}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex flex-row justify-end items-center gap-2">
          <button
            className="px-4 py-2 w-24 bg-gray-200 hover:bg-gray-400 rounded-md text-gray-700 font-bold text-sm"
            onClick={onClose}
          >
            Đóng
          </button>
          <button
            className="
          px-4 py-2 w-26 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-bold text-sm
        "
          >
            Thêm tăng ca
          </button>
        </div>
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
            <div className="w-[152px] flex flex-row justify-between items-center cursor-pointer">
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
            <div className="w-[152px] flex flex-row justify-between items-center cursor-pointer">
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
          {timeSheets.find(
            (timeSheet) => timeSheet.session === SessionDate.Night
          )?.overtime && (
            <div className="grid grid-cols-2 justify-center items-center">
              <div className="flex justify-start">
                <span className="font-bold text-sm text-gray-700">Ca tối:</span>
              </div>
              <div className="w-[152px] flex flex-row justify-between items-center cursor-pointer">
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
                  options={statusOptions}
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
