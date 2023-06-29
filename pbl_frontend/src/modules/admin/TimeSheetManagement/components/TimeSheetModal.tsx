import React from "react";
import { TimeSheetAction } from "../../../../actions/timeSheetAction";
import { TimeSheet } from "../../../../types/timeSheet";
import { UserDetailInformation } from "../../../../types/userTypes";
import { UserAction } from "../../../../actions/userAction";
import { SessionDate, TimeSheetStatus } from "../../../../constants/enum";
import { dateHelper, isWeekend } from "../../../../utils/datetime";
import dayjs from "dayjs";
import { Popover } from "antd";
import { FiChevronDown } from "react-icons/fi";

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
  const [selectTimeSheetStatus, setSelectTimeSheetStatus] = React.useState<{
    session: SessionDate;
    status: TimeSheetStatus;
  }>({
    session: "" as SessionDate,
    status: "" as TimeSheetStatus,
  });

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

  const renderStatus = (
    timeSheet: TimeSheet,
    timeSheetSession: SessionDate,
    date: string,
    leaveDayCond: {
      isLeaveDay: boolean;
      context: string;
    }
  ) => {
    return (
      <div className="grid grid-cols-2 justify-center items-center">
        <div className="flex justify-start">
          <span className="font-bold text-sm text-gray-700">{`Ca ${timeSheetSession}:`}</span>
        </div>
        <div className="w-full flex flex-row justify-between items-center cursor-pointer">
          <Popover
            placement="bottom"
            trigger={"click"}
            content={
              <div className="w-full flex flex-col">
                <div
                  className={`w-full m-0 p-2 border rounded-sm flex justify-center items-center gap-1
                border-green-500 bg-green-200 text-green-600
                  hover:cursor-pointer hover:bg-green-300 hover:text-green-700`}
                  onClick={() => {
                    // setSelectTimeSheetStatus({
                    //   session: timeSheetSession,
                    //   status: TimeSheetStatus.Submitted,
                    // });
                    timeSheet.status = TimeSheetStatus.Submitted;
                  }}
                >
                  <span className="font-bold text-[12px]">
                    {TimeSheetStatus.Submitted}
                  </span>
                </div>
                <div
                  className={`w-full m-0 p-2 border rounded-sm flex justify-center items-center gap-1
                border-blue-500 bg-blue-200 text-blue-600
                  hover:cursor-pointer hover:bg-blue-300 hover:text-blue-700`}
                  onClick={() =>
                    // setSelectTimeSheetStatus({
                    //   session: timeSheetSession,
                    //   status: TimeSheetStatus.Overtime,
                    // })
                    (timeSheet.status = TimeSheetStatus.Overtime)
                  }
                >
                  <span className="font-bold text-[12px]">
                    {TimeSheetStatus.Overtime}
                  </span>
                </div>
                <div
                  className={`w-full m-0 p-2 border rounded-sm flex justify-center items-center gap-1
                border-red-500 bg-red-200 text-red-600
                  hover:cursor-pointer hover:bg-red-300 hover:text-red-700`}
                  onClick={() =>
                    // setSelectTimeSheetStatus({
                    //   session: timeSheetSession,
                    //   status: TimeSheetStatus.LeaveWithRequest,
                    // })
                    (timeSheet.status = TimeSheetStatus.LeaveWithoutRequest)
                  }
                >
                  <span className="font-bold text-[12px]">
                    {TimeSheetStatus.LeaveWithoutRequest}
                  </span>
                </div>
                <div
                  className={`w-full m-0 p-2 border rounded-sm flex justify-center items-center gap-1
                border-gray-500 bg-gray-200 text-gray-600
                  hover:cursor-pointer hover:bg-gray-300 hover:text-gray-700`}
                  onClick={() =>
                    // setSelectTimeSheetStatus({
                    //   session: timeSheetSession,
                    //   status: TimeSheetStatus.LeaveWithoutRequest,
                    // })
                    (timeSheet.status = TimeSheetStatus.Unsubmitted)
                  }
                >
                  <span className="font-bold text-[12px]">
                    {TimeSheetStatus.Unsubmitted}
                  </span>
                </div>
              </div>
            }
          >
            <div
              className={`w-36 p-2 border rounded-md flex justify-center items-center gap-1
                ${
                  checkStatus(timeSheet, date, leaveDayCond)?.status ===
                    TimeSheetStatus.Submitted &&
                  `border-green-500 bg-green-200 text-green-600`
                }
                ${
                  checkStatus(timeSheet, date, leaveDayCond)?.status ===
                    TimeSheetStatus.Unsubmitted &&
                  `border-gray-500 bg-gray-200 text-gray-600`
                }
                ${
                  checkStatus(timeSheet, date, leaveDayCond)?.status ===
                    TimeSheetStatus.LeaveWithRequest &&
                  `border-yellow-500 bg-yellow-200 text-yellow-600`
                }
                ${
                  checkStatus(timeSheet, date, leaveDayCond)?.status ===
                    TimeSheetStatus.LeaveWithoutRequest &&
                  `border-red-500 bg-red-200 text-red-600`
                }
                ${
                  checkStatus(timeSheet, date, leaveDayCond)?.status ===
                    TimeSheetStatus.Overtime &&
                  `border-blue-500 bg-blue-200 text-blue-600`
                }
                `}
            >
              <span className="font-bold text-[12px]">
                {checkStatus(timeSheet, date, leaveDayCond)?.status}
              </span>
              <span className="font-bold text-[12px]">
                <FiChevronDown />
              </span>
            </div>
          </Popover>
        </div>
      </div>
    );
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
            <div>
              {renderStatus(
                timeSheets.find(
                  (timeSheet) => timeSheet.session === SessionDate.Morning
                ) ?? ({} as TimeSheet),
                SessionDate.Morning,
                date,
                leaveDay
              )}
            </div>
          )}
          {timeSheets.find(
            (timeSheet) => timeSheet.session === SessionDate.Afternoon
          )?.overtime && (
            <div>
              {renderStatus(
                timeSheets.find(
                  (timeSheet) => timeSheet.session === SessionDate.Afternoon
                ) ?? ({} as TimeSheet),
                SessionDate.Afternoon,
                date,
                leaveDay
              )}
            </div>
          )}
          {timeSheets.find(
            (timeSheet) => timeSheet.session === SessionDate.Night
          )?.overtime && (
            <div>
              {renderStatus(
                timeSheets.find(
                  (timeSheet) => timeSheet.session === SessionDate.Night
                ) ?? ({} as TimeSheet),
                SessionDate.Night,
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
        <div>
          {renderStatus(
            timeSheets.find(
              (timeSheet) => timeSheet.session === SessionDate.Morning
            ) ?? ({} as TimeSheet),
            SessionDate.Morning,
            date,
            leaveDay
          )}
        </div>
        <div>
          {renderStatus(
            timeSheets.find(
              (timeSheet) => timeSheet.session === SessionDate.Afternoon
            ) ?? ({} as TimeSheet),
            SessionDate.Afternoon,
            date,
            leaveDay
          )}
        </div>
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
