import React from "react";
import { TimeSheetAction } from "../../../../actions/timeSheetAction";
import { TimeSheet } from "../../../../types/timeSheet";
import { UserDetailInformation } from "../../../../types/userTypes";
import { UserAction } from "../../../../actions/userAction";
import { SessionDate, TimeSheetStatus } from "../../../../constants/enum";
import { dateHelper, isWeekend } from "../../../../utils/datetime";
import dayjs from "dayjs";

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

  React.useEffect(() => {
    const fetchData = async () => {
      setTimeSheets((await TimeSheetAction.getByDate(userId, date)) ?? []);
      setUser(
        (await UserAction.getUserInfo(userId)) ?? ({} as UserDetailInformation)
      );
    };

    fetchData();
  }, [date, userId]);

  const checkStatus = (
    timeSheet: TimeSheet,
    date: string,
    isLeaveDay: {
      isLeaveDay: boolean;
      context: string;
    }
  ) => {
    if (timeSheet.status === TimeSheetStatus.Submitted && !timeSheet.overtime) {
      return (
        <div className="w-full flex flex-row justify-between items-center">
          <div className="w-32 p-2 bg-green-200 border rounded-md flex justify-center items-center">
            <span className="text-green-600 font-bold text-[12px]">
              {timeSheets[0].status}
            </span>
          </div>
          <div className="font-bold text-xs">{timeSheet.timeIn}</div>
        </div>
      );
    }

    if (timeSheet.status === TimeSheetStatus.Submitted && timeSheet.overtime) {
      return (
        <div className="w-full flex flex-row justify-between items-center">
          <div className="w-32 p-2 bg-blue-200 border rounded-md flex justify-center items-center">
            <span className="text-blue-600 font-bold text-[12px]">Tăng ca</span>
          </div>
          <div className="font-bold text-xs">{timeSheet.timeIn}</div>
        </div>
      );
    }

    if (!timeSheet.status) {
      if (
        dateHelper.dateToString.isBefore(
          date,
          dateHelper.dateToString.toString(new Date())
        )
      ) {
        return (
          <div className="w-full flex flex-row justify-between items-center">
            <div className="w-32 p-2 bg-red-200 border rounded-md flex justify-center items-center">
              <span className="text-red-600 font-bold text-[12px]">
                {TimeSheetStatus.LeaveWithoutRequest}
              </span>
            </div>
          </div>
        );
      }

      if (isLeaveDay.isLeaveDay) {
        return (
          <div className="w-full flex flex-row justify-between items-center">
            <div className="w-32 p-2 bg-yellow-200 border rounded-md flex justify-center items-center">
              <span className="text-yellow-600 font-bold text-[12px]">
                {TimeSheetStatus.LeaveWithRequest}
              </span>
            </div>
          </div>
        );
      }

      return (
        <div>
          <div className="w-32 p-2 bg-gray-200 border rounded-md flex justify-center items-center">
            <span className="text-gray-600 font-bold text-[12px]">
              {TimeSheetStatus.Unsubmitted}
            </span>
          </div>
        </div>
      );
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
              {checkStatus(
                timeSheets.find(
                  (timeSheet) => timeSheet.session === SessionDate.Morning
                ) ?? ({} as TimeSheet),
                date,
                leaveDay
              )}
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
              {checkStatus(
                timeSheets.find(
                  (timeSheet) => timeSheet.session === SessionDate.Afternoon
                ) ?? ({} as TimeSheet),
                date,
                leaveDay
              )}
            </div>
          )}
          {timeSheets.find(
            (timeSheet) => timeSheet.session === SessionDate.Night
          )?.overtime && (
            <div className="grid grid-cols-2 justify-center items-center">
              <div className="flex justify-start">
                <span className="font-bold text-sm text-gray-700">Ca Tối:</span>
              </div>
              {checkStatus(
                timeSheets.find(
                  (timeSheet) => timeSheet.session === SessionDate.Night
                ) ?? ({} as TimeSheet),
                date,
                leaveDay
              )}
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
        <div className="grid grid-cols-2 justify-center items-center">
          <div className="flex justify-start">
            <span className="font-bold text-sm text-gray-700">Ca sáng:</span>
          </div>
          {checkStatus(
            timeSheets.find(
              (timeSheet) => timeSheet.session === SessionDate.Morning
            ) ?? ({} as TimeSheet),
            date,
            leaveDay
          )}
        </div>
        <div className="grid grid-cols-2 justify-center items-center">
          <div className="flex justify-start">
            <span className="font-bold text-sm text-gray-700">Ca chiều:</span>
          </div>
          {checkStatus(
            timeSheets.find(
              (timeSheet) => timeSheet.session === SessionDate.Afternoon
            ) ?? ({} as TimeSheet),
            date,
            leaveDay
          )}
        </div>
        {timeSheets.find((timeSheet) => timeSheet.session === SessionDate.Night)
          ?.overtime && (
          <div className="grid grid-cols-2 justify-center items-center">
            <div className="flex justify-start">
              <span className="font-bold text-sm text-gray-700">Ca Tối:</span>
            </div>
            {checkStatus(
              timeSheets.find(
                (timeSheet) => timeSheet.session === SessionDate.Night
              ) ?? ({} as TimeSheet),
              date,
              leaveDay
            )}
          </div>
        )}
      </div>
      {!leaveDay.isLeaveDay && (
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
            onClick={() => setIsEditTimeSheet(true)}
          >
            Chỉnh sửa
          </button>
        </div>
      )}
    </div>
  );
};

export default TimeSheetModal;
