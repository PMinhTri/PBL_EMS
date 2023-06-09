import React from "react";
import {
  LeaveRequest,
  LeaveStatus,
  LeaveType,
} from "../../../../types/leaveTypes";
import { LeaveAction } from "../../../../actions/leaveAction";
import dayjs from "dayjs";
import { BiEdit } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";
import { Button, Modal } from "antd";
import showNotification from "../../../../utils/notification";
import UpdateRequest from "./UpdateForm";
import { defaultRequest } from "../../../../constants/constantVariables";

type Props = {
  userId: string;
};

const currentYears = Array.from(
  { length: 5 },
  (_, index) => new Date().getFullYear() + index
);

const RequestHistory: React.FunctionComponent<Props> = (props: Props) => {
  const { userId } = props;
  const [requestHistoryData, setRequestHistoryData] = React.useState<
    LeaveRequest[]
  >([]);
  const [leaveType, setLeaveType] = React.useState<LeaveType[]>([]);
  const [isUpdateRequest, setIsUpdateRequest] = React.useState<{
    isOpen: boolean;
    item: LeaveRequest;
  }>({
    isOpen: false,
    item: defaultRequest,
  });
  const [selectedMonth, setSelectedMonth] = React.useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = React.useState<number>(
    new Date().getFullYear()
  );

  const [isOpenCancelModal, setIsOpenCancelModal] = React.useState(false);

  React.useEffect(() => {
    const fetchDate = async () => {
      const leaveRequests = userId
        ? await LeaveAction.getAllLeaveRequestByUserId(
            userId,
            selectedMonth,
            selectedYear
          )
        : await LeaveAction.getAllLeaveRequest(selectedMonth, selectedYear);
      setLeaveType(await LeaveAction.getAllLeaveType());
      setRequestHistoryData(leaveRequests ?? []);
    };

    fetchDate();
  }, [selectedMonth, selectedYear, userId]);

  const handleCancelRequest = async (id: string) => {
    try {
      await LeaveAction.cancel(id);

      showNotification("success", "Hủy yêu cầu thành công");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      showNotification("error", "Hủy yêu cầu nghỉ phép thất bại");
    }
  };

  return (
    <div className="w-full mt-3 bg-white p-6 border flex flex-col rounded-lg shadow-lg gap-2">
      <h2 className="text-xl font-bold mb-4">Lịch sử yêu cầu</h2>
      <div className="w-full flex flex-row gap-2">
        <div>
          <label className="mx-2">Năm:</label>
          <select
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {currentYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mx-2">Tháng:</label>
          <select
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
            <option value={11}>11</option>
            <option value={12}>12</option>
          </select>
        </div>
      </div>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-center border-b">Ngày bắt đầu</th>
            <th className="py-3 px-4 text-center border-b">Ngày kết thúc</th>
            <th className="py-3 px-4 text-center border-b">Loại phép</th>
            <th className="py-3 px-4 text-center border-b">Số ngày nghỉ</th>
            <th className="py-3 px-4 text-center border-b">Buổi</th>
            <th className="py-3 px-4 text-center border-b">Lý do</th>
            <th className="py-3 px-4 text-center border-b">Trạng thái</th>
            <th className="py-3 px-4 text-center border-b">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {requestHistoryData.map((item, index) => (
            <tr key={index}>
              <td className="py-3 px-4 text-center border-b">
                {dayjs(item.startDate).format("DD/MM/YYYY")}
              </td>
              <td className="py-3 px-4 text-center border-b">
                {dayjs(item.endDate).format("DD/MM/YYYY")}
              </td>
              <td className="py-3 px-4 text-center border-b">
                {leaveType.find((type) => type.id === item.leaveTypeId)?.name}
              </td>
              <td className="py-3 px-4 text-center border-b">
                {item.leaveDays}
              </td>
              <td className="py-3 px-8 text-center border-b">{item.session}</td>
              <td className="py-3 px-4 text-center border-b">{item.reason}</td>
              <td className={`py-3 px-4 text-center border-b`}>
                <div
                  className={`inline-flex justify-center items-center w-24 gap-1 rounded-sm
                    px-2 py-2 text-xs font-semibold ${
                      item.status === LeaveStatus.Pending &&
                      "bg-blue-200 text-blue-600"
                    } ${
                    item.status === LeaveStatus.Rejected &&
                    "bg-red-200 text-red-600"
                  } ${
                    item.status === LeaveStatus.Approved &&
                    "bg-green-200 text-green-600 "
                  } ${
                    item.status === LeaveStatus.Cancelled &&
                    "bg-gray-200 text-gray-600"
                  }`}
                >
                  {item.status}
                </div>
              </td>
              <td className="py-3 px-4 text-center border-b">
                {item.status === LeaveStatus.Pending && (
                  <div className="w-full flex flex-row gap-2 justify-center items-center">
                    <div
                      className="text-green-500 text-2xl hover:text-green-600 hover:cursor-pointer"
                      onClick={() => setIsUpdateRequest({ isOpen: true, item })}
                    >
                      <BiEdit />
                    </div>
                    <div
                      className="text-red-500 text-2xl hover:text-red-600 hover:cursor-pointer"
                      onClick={() => setIsOpenCancelModal(true)}
                    >
                      <MdOutlineCancel />
                    </div>
                  </div>
                )}
              </td>
              <Modal
                title="Bạn muốn hủy yêu cầu này?"
                open={isOpenCancelModal}
                width={400}
                onCancel={() => setIsOpenCancelModal(false)}
                destroyOnClose={true}
                footer={[
                  <button
                    onClick={() => setIsOpenCancelModal(false)}
                    className="w-24 ml-2 rounded-md h-8 bg-red-500 text-white cursor-pointer"
                  >
                    Hủy
                  </button>,
                  <Button
                    className="ml-2 w-24 rounded-md h-8 bg-blue-500 text-white cursor-pointer"
                    onClick={() => handleCancelRequest(item.id)}
                  >
                    Xóa
                  </Button>,
                ]}
              />
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        open={isUpdateRequest.isOpen}
        width={800}
        onCancel={() =>
          setIsUpdateRequest({
            isOpen: false,
            item: defaultRequest,
          })
        }
        destroyOnClose={true}
        footer={null}
      >
        <UpdateRequest leaveRequest={isUpdateRequest.item} />
      </Modal>
    </div>
  );
};

export default RequestHistory;
