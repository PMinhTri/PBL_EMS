import React from "react";
import { BiInfoCircle, BiEdit } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";
import { Modal } from "antd";
import showNotification from "../../../../utils/notification";
import { LeaveAction } from "../../../../actions/leaveAction";
import { LeaveRequest, LeaveType } from "../../../../types/leaveTypes";
import dayjs from "dayjs";
import { UserDetailInformation } from "../../../../types/userTypes";

const currentYears = Array.from(
  { length: 5 },
  (_, index) => new Date().getFullYear() + index
);

type Props = {
  employees: UserDetailInformation[];
};

const LeaveRequestManagement: React.FunctionComponent<Props> = (
  props: Props
) => {
  const { employees } = props;
  const [selectedMonth, setSelectedMonth] = React.useState(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = React.useState(
    new Date().getFullYear()
  );

  const [requestHistoryData, setRequestHistoryData] = React.useState<
    LeaveRequest[]
  >([]);

  const [leaveType, setLeaveType] = React.useState<LeaveType[]>([]);

  const [isOpenCancelModal, setIsOpenCancelModal] = React.useState(false);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(e.target.value));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  const handleRejectRequest = async (id: string) => {
    try {
      await LeaveAction.cancel(id);

      showNotification("success", "Hủy yêu cầu thành công");

      setTimeout(() => {
        window.location.href = "/employee/time-sheet";
      }, 1000);
    } catch (err) {
      showNotification("error", "Hủy yêu cầu nghỉ phép thất bại");
    }
  };

  React.useEffect(() => {
    const fetchDate = async () => {
      const leaveRequests = await LeaveAction.getAllLeaveRequest(
        selectedMonth,
        selectedYear
      );
      setLeaveType(await LeaveAction.getAllLeaveType());
      setRequestHistoryData(leaveRequests ?? []);
    };

    fetchDate();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="w-full mt-3 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Quản lý yêu cầu nghỉ phép</h2>
      <div className="flex justify-start mb-4">
        <div>
          <label className="mx-2">Năm:</label>
          <select
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={selectedYear}
            onChange={handleYearChange}
          >
            {currentYears.map((year) => (
              <option value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mx-2">Tháng:</label>
          <select
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={selectedMonth}
            onChange={handleMonthChange}
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
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Lịch sử yêu cầu</h2>
        <div className="flex border-[2px] max-h-80 overflow-x-auto overflow-y-auto scrollbar">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-center border-b">Họ và tên</th>
                <th className="py-3 px-4 text-center border-b">Ngày bắt đầu</th>
                <th className="py-3 px-4 text-center border-b">
                  Ngày kết thúc
                </th>
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
                    {
                      employees.find((employee) => employee.id === item.userId)
                        ?.fullName
                    }
                  </td>
                  <td className="py-3 px-4 text-center border-b">
                    {dayjs(item.startDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-3 px-4 text-center border-b">
                    {dayjs(item.endDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-3 px-4 text-center border-b">
                    {
                      leaveType.find((type) => type.id === item.leaveTypeId)
                        ?.name
                    }
                  </td>
                  <td className="py-3 px-4 text-center border-b">
                    {item.leaveDays}
                  </td>
                  <td className="py-3 px-8 text-center border-b">
                    {item.session}
                  </td>
                  <td className="py-3 px-4 text-center border-b">
                    {item.reason}
                  </td>
                  <td className="py-3 px-4 text-center border-b">
                    {item.status}
                  </td>
                  <td className="py-3 px-4 text-center border-b">
                    <div className="w-full flex flex-row gap-2 justify-center items-center">
                      <div className="text-blue-500 text-2xl hover:text-blue-600 hover:cursor-pointer">
                        <BiInfoCircle />
                      </div>
                      <div className="text-green-500 text-2xl hover:text-green-600 hover:cursor-pointer">
                        <BiEdit />
                      </div>
                      <div
                        className="text-red-500 text-2xl hover:text-red-600 hover:cursor-pointer"
                        onClick={() => setIsOpenCancelModal(true)}
                      >
                        <MdOutlineCancel />
                      </div>
                    </div>
                  </td>
                  <Modal
                    title="Bạn muốn hủy yêu cầu này?"
                    open={isOpenCancelModal}
                    width={400}
                    onCancel={() => setIsOpenCancelModal(false)}
                    footer={[
                      <button
                        onClick={() => setIsOpenCancelModal(false)}
                        className="w-24 ml-2 rounded-md h-8 bg-red-500 text-white cursor-pointer"
                      >
                        Hủy
                      </button>,
                      <button
                        className="ml-2 w-24 rounded-md h-8 bg-blue-500 text-white cursor-pointer"
                        onClick={() => handleRejectRequest(item.id)}
                      >
                        Xóa
                      </button>,
                    ]}
                  ></Modal>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestManagement;
