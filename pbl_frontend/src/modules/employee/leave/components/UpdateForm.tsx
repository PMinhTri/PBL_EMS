import React from "react";
import { LeaveRequest, LeaveType } from "../../../../types/leaveTypes";
import { DatePicker, Progress } from "antd";
import dayjs from "dayjs";
import showNotification from "../../../../utils/notification";
import { getWorkingDay, isWeekend } from "../../../../utils/datetime";
import { useRecoilValue } from "recoil";
import userSelector from "../../../../recoil/selectors/user";
import { LeaveAction } from "../../../../actions/leaveAction";
import { SessionDate } from "../../../../constants/enum";

type Props = {
  leaveRequest: LeaveRequest;
};

const UpdateRequest: React.FunctionComponent<Props> = (props: Props) => {
  const { leaveRequest } = props;
  const [isUpdate, setIsUpdate] = React.useState(false);

  const { userAuthInfo } = useRecoilValue(userSelector);
  const [startDate, setStartDate] = React.useState<Date>(
    leaveRequest.startDate
  );
  const [endDate, setEndDate] = React.useState<Date>(leaveRequest.endDate);
  const [reason, setReason] = React.useState(leaveRequest.reason);
  const [onSelectSession, setOnSelectSession] = React.useState<string>(
    leaveRequest.session
  );

  const [onSelectLeaveType, setOnSelectLeaveType] = React.useState<LeaveType>({
    id: "",
    name: "",
    balance: 0,
  });
  const [remaining, setRemaining] = React.useState<number>(0);

  const [leaveType, setLeaveType] = React.useState<LeaveType[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const leaveTypes = await LeaveAction.getAllLeaveType();

      setLeaveType(leaveTypes);
      setOnSelectLeaveType(leaveTypes[0]);
    };

    fetchData();
  }, [userAuthInfo.id]);

  React.useMemo(async () => {
    const balance = await LeaveAction.getRemainingBalanceByUser(
      userAuthInfo.id,
      onSelectLeaveType.id,
      new Date().getFullYear()
    );

    setRemaining(balance);
  }, [onSelectLeaveType.id, userAuthInfo.id]);

  const session = React.useMemo(() => {
    if (dayjs(startDate).isSame(endDate, "day")) {
      return [SessionDate.FullDay, SessionDate.Morning, SessionDate.Afternoon];
    } else {
      return [SessionDate.FullDay];
    }
  }, [startDate, endDate]);

  const leaveDays = React.useMemo(() => {
    if (dayjs(startDate).isSame(endDate, "day")) {
      if (onSelectSession === SessionDate.FullDay) {
        return 1;
      } else {
        if (
          onSelectSession === SessionDate.Morning ||
          onSelectSession === SessionDate.Afternoon
        ) {
          return 0.5;
        } else {
          return 1;
        }
      }
    } else {
      return getWorkingDay(startDate, endDate);
    }
  }, [startDate, endDate, onSelectSession]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!startDate || !endDate || !onSelectSession || !reason) {
      showNotification("warning", "Vui lòng điền đầy đủ thông tin.");
      return;
    } else {
      const response = await LeaveAction.updateLeaveRequest(leaveRequest.id, {
        userId: userAuthInfo.id,
        leaveTypeId: onSelectLeaveType.id,
        startDate: startDate,
        endDate: endDate,
        reason: reason.trim(),
        session: onSelectSession,
        leaveDays: leaveDays,
      });

      if (response) {
        showNotification("success", "Cập nhật yêu cầu thành công!");

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };

  React.useEffect(() => setIsUpdate(false), []);

  return (
    <div className="bg-white p-6">
      <h2 className="text-xl font-bold mb-4">Yêu cầu nghỉ phép</h2>
      <form>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="leaveType"
            >
              Loại nghỉ phép
            </label>
            <select
              disabled={!isUpdate}
              defaultValue={
                leaveType.find((type) => type.id === leaveRequest.leaveTypeId)
                  ?.id
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              onChange={(e) => {
                setOnSelectLeaveType(
                  leaveType.find((type) => type.id === e.target.value) || {
                    id: "",
                    name: "",
                    balance: 0,
                  }
                );
              }}
            >
              {leaveType.map((type) => (
                <option value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col ">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="leaveType"
            >
              Số ngày phép còn lại
            </label>
            <Progress
              format={() =>
                `${onSelectLeaveType.balance - remaining}/${
                  onSelectLeaveType.balance
                }`
              }
              percent={
                ((onSelectLeaveType.balance - remaining) /
                  onSelectLeaveType.balance) *
                100
              }
              size="default"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="startDate"
            >
              Ngày bắt đầu
            </label>
            <DatePicker
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              disabled={!isUpdate}
              value={dayjs(startDate)}
              defaultValue={dayjs(startDate)}
              onChange={(date) => {
                if (isWeekend(dayjs(date).toDate())) {
                  showNotification(
                    "warning",
                    "Không thể tạo ngày nghỉ vào cuối tuần"
                  );

                  return;
                }

                setStartDate(dayjs(date).toDate());
                setEndDate(dayjs(date).toDate());
              }}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="endDate"
            >
              Ngày kết thúc
            </label>
            <DatePicker
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={dayjs(endDate)}
              disabled={!isUpdate}
              defaultValue={dayjs(endDate)}
              onChange={(date) => {
                if (isWeekend(dayjs(date).toDate())) {
                  showNotification(
                    "warning",
                    "Không thể tạo ngày nghỉ vào cuối tuần"
                  );

                  return;
                }
                if (dayjs(date).isBefore(startDate)) {
                  showNotification(
                    "warning",
                    "Ngày kết thúc không thể trước ngày bắt đầu"
                  );

                  return;
                }

                setEndDate(dayjs(date).toDate());
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="leaveDays"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Thời gian nghỉ
            </label>
            <input
              disabled
              type="number"
              id="leaveDays"
              value={leaveDays}
              defaultValue={leaveDays}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="session"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Buổi nghỉ
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              id="session"
              disabled={!isUpdate}
              value={onSelectSession}
              onChange={(e) => setOnSelectSession(e.target.value)}
              required
            >
              {session.map((session) => (
                <option value={session}>{session}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="reason"
          >
            Lý do
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            id="reason"
            disabled={!isUpdate}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        {isUpdate && (
          <div className="flex gap-1 flex-row">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Cập nhật
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => setIsUpdate(false)}
            >
              Hủy
            </button>
          </div>
        )}
        {!isUpdate && (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsUpdate(true)}
          >
            Chỉnh sửa
          </button>
        )}
      </form>
    </div>
  );
};

export default UpdateRequest;
