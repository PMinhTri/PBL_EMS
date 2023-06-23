import { DatePicker, Progress } from "antd";
import React from "react";
import { LeaveAction } from "../../../../actions/leaveAction";
import { LeaveType } from "../../../../types/leaveTypes";
import dayjs from "dayjs";
import { getWorkingDay, isWeekend } from "../../../../utils/datetime";
import showNotification from "../../../../utils/notification";
import { useRecoilValue } from "recoil";
import userSelector from "../../../../recoil/selectors/user";
import { SessionDate } from "../../../../constants/enum";

export const RequestForm: React.FunctionComponent = () => {
  const { userAuthInfo } = useRecoilValue(userSelector);
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const [reason, setReason] = React.useState("");
  const [onSelectSession, setOnSelectSession] =
    React.useState<string>("Cả ngày");
  const [onLeaveDaysChange, setOnLeaveDaysChange] = React.useState<string>("0");
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

  const handleSubmit = async () => {
    if (!startDate || !endDate || !onSelectSession || !reason) {
      showNotification("warning", "Vui lòng điền đầy đủ thông tin.");
      return;
    } else {
      const response = await LeaveAction.createLeaveRequest({
        userId: userAuthInfo.id,
        leaveTypeId: onSelectLeaveType.id,
        startDate: startDate,
        endDate: endDate,
        reason: reason.trim(),
        session: onSelectSession,
        leaveDays:
          onLeaveDaysChange === "0" ? leaveDays : Number(onLeaveDaysChange),
      });

      if (response) {
        showNotification("success", "Tạo yêu cầu thành công!");

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };

  return (
    <div className="bg-white border p-6 rounded-lg shadow-lg">
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
              name="leaveType"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
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
              name="startDate"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
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
              allowClear={false}
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
              name="endDate"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
              value={dayjs(endDate)}
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
              allowClear={false}
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
              type="number"
              id="leaveDays"
              value={leaveDays}
              defaultValue={leaveDays}
              onChange={(e) => setOnLeaveDaysChange(e.target.value)}
              className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
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
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
              id="session"
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
            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Gửi
        </button>
      </form>
    </div>
  );
};
