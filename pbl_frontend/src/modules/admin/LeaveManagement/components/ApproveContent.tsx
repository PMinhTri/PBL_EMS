import React from "react";
import { LeaveRequest } from "../../../../types/leaveTypes";
import { UserDetailInformation } from "../../../../types/userTypes";
import { UserAction } from "../../../../actions/userAction";
import { LeaveAction } from "../../../../actions/leaveAction";
import dayjs from "dayjs";

type Props = {
  leaveRequest: LeaveRequest;
};

const ApproveContent: React.FunctionComponent<Props> = (props: Props) => {
  const { leaveRequest } = props;

  const [userInfo, setUserInfo] = React.useState<UserDetailInformation>(
    {} as UserDetailInformation
  );

  const [remaining, setRemaining] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchData = async () => {
      setUserInfo(
        (await UserAction.getUserInfo(leaveRequest.userId)) ??
          ({} as UserDetailInformation)
      );
      setRemaining(
        (await LeaveAction.getRemainingBalanceByUser(
          leaveRequest.userId,
          leaveRequest.leaveType?.id ?? "0",
          new Date().getFullYear()
        )) ?? 0
      );
    };

    fetchData();
  }, [leaveRequest.leaveType?.id, leaveRequest.userId, setUserInfo]);

  return (
    <div className="w-full p-2 flex flex-col gap-1">
      <div className="w-full flex justify-start items-center text-lg font-bold">
        Thông tin yêu cầu nghỉ phép
      </div>
      <div className="w-full border-[2px] rounded-md flex flex-col p-2 gap-2">
        <div className="w-full grid grid-cols-2 flex-row gap-1">
          <div className="font-bold ">Họ tên nhân viên:</div>
          <div className="font-[500px]">{userInfo.fullName}</div>
        </div>
        <div className="w-full grid grid-cols-2 flex-row gap-1">
          <div className="font-bold ">Chức vụ:</div>
          <div>{userInfo.jobInformation?.jobTitle?.name}</div>
        </div>
        <div className="w-full grid grid-cols-2 flex-row gap-1">
          <div className="font-bold ">Loại phép:</div>
          <div>{leaveRequest.leaveType?.name}</div>
        </div>
        <div className="w-full grid grid-cols-2 flex-row gap-1">
          <div className="font-bold ">Số phép được nghỉ:</div>
          <div>{leaveRequest.leaveType?.balance}</div>
        </div>
        <div className="w-full grid grid-cols-2 flex-row gap-1">
          <div className="font-bold ">Số phép còn lại:</div>
          <div>{remaining}</div>
        </div>
        <div className="w-full grid grid-cols-2 flex-row gap-1">
          <div className="font-bold ">Ngày bắt đầu nghỉ:</div>
          <div>{dayjs(leaveRequest.startDate).format("DD-MM-YYYY")}</div>
        </div>
        <div className="w-full grid grid-cols-2 flex-row gap-1">
          <div className="font-bold ">Ngày kết thúc nghỉ:</div>
          <div>{dayjs(leaveRequest.endDate).format("DD-MM-YYYY")}</div>
        </div>
        <div className="w-full grid grid-cols-2 flex-row gap-1">
          <div className="font-bold ">Tổng số ngày nghỉ:</div>
          <div>{leaveRequest.leaveDays}</div>
        </div>
        <div className="w-full grid grid-cols-2 flex-row gap-1">
          <div className="font-bold ">Lý do:</div>
          <div>{leaveRequest.reason}</div>
        </div>
        <div className="w-full flex flex-col gap-1">
          <div className="font-bold ">Ý kiến phê duyệt:</div>
          <textarea
            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-blue-600 focus:shadow-md"
            id="reason"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ApproveContent;
