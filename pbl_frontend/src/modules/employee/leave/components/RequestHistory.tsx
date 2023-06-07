import React from "react";
import { LeaveRequest } from "../../../../types/leave";
import { LeaveAction } from "../../../../actions/leaveAction";
import { useRecoilValue } from "recoil";
import userSelector from "../../../../recoil/selectors/user";
import dayjs from "dayjs";
import { BiEdit } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";
import { Button, Modal } from "antd";
import showNotification from "../../../../utils/notification";

const RequestHistory: React.FunctionComponent = () => {
  const { userAuthInfo } = useRecoilValue(userSelector);
  const [requestHistoryData, setRequestHistoryData] = React.useState<
    LeaveRequest[]
  >([]);

  const [isOpenCancelModal, setIsOpenCancelModal] = React.useState(false);

  React.useEffect(() => {
    const fetchDate = async () => {
      const leaveRequests = await LeaveAction.getLeaveRequestsByUser(
        userAuthInfo.id
      );
      setRequestHistoryData(leaveRequests ?? []);
    };

    fetchDate();
  }, [userAuthInfo.id]);

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
    <div className="w-full mt-3 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Lịch sử yêu cầu</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-center border-b">Ngày bắt đầu</th>
            <th className="py-3 px-4 text-center border-b">Ngày kết thúc</th>
            <th className="py-3 px-4 text-center border-b">Số ngày nghỉ</th>
            <th className="py-3 px-4 text-center border-b">Buổi</th>
            <th className="py-3 px-8 text-center border-b">Lý do</th>
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
                {item.leaveDays}
              </td>
              <td className="py-3 px-8 text-center border-b">{item.session}</td>
              <td className="py-3 px-4 text-center border-b">{item.reason}</td>
              <td className="py-3 px-4 text-center border-b">{item.status}</td>
              <td className="py-3 px-4 text-center border-b">
                <div className="w-full flex flex-row gap-2 justify-center items-center">
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
                  <Button
                    className="ml-2 w-24 rounded-md h-8 bg-blue-500 text-white cursor-pointer"
                    onClick={() => handleCancelRequest(item.id)}
                  >
                    Xóa
                  </Button>,
                ]}
              ></Modal>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestHistory;
