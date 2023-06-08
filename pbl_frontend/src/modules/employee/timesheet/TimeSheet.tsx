import React from "react";
import MyTimeSheetStats from "./components/MyTimeSheetStats";
import CalendarContainer from "./components/CalendarContainer";
import dayjs, { Dayjs } from "dayjs";
import { AiFillPlusCircle } from "react-icons/ai";
import { Modal } from "antd";
import OvertimeModal from "./components/OvertimeModal";
import showNotification from "../../../utils/notification";
import { TimeSheetAction } from "../../../actions/timeSheetAction";
import { useRecoilValue } from "recoil";
import userSelector from "../../../recoil/selectors/user";
import { Session } from "../../../constants/constantVariables";
import { SessionDate } from "../../../constants/enum";

const TimeSheetPage: React.FunctionComponent = () => {
  const { userAuthInfo } = useRecoilValue(userSelector);
  const [selectedDate, setSelectedDate] = React.useState<string>("");
  const [selectedSession, setSelectedSession] = React.useState<string>("");
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const [currentDate, setCurrentDate] = React.useState<Dayjs>(dayjs());

  const handleCreateOvertime = async () => {
    if (!dayjs(selectedDate).isSame(new Date())) {
      showNotification(
        "error",
        "Bạn không thể tạo lịch tăng ca khi chưa đến ngày!"
      );
      return;
    }
    if (dayjs(selectedDate).day() === 6 || dayjs(selectedDate).day() === 0) {
      try {
        await TimeSheetAction.create({
          userId: userAuthInfo.id,
          session: selectedSession,
          hoursWorked: Session[selectedSession as SessionDate],
          status: "Đã chấm công",
          timeIn: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          date: selectedDate,
          overtime: true,
        });
        showNotification("success", "Chấm công thành công!");

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (err) {
        showNotification("error", "Chấm công thất bại! Vui lòng thử lại sau");
      }
    }

    showNotification("error", "Bạn không thể tăng ca vào ngày trong tuần!");
  };

  return (
    <div className="p-2 w-full flex flex-col h-screen bg-slate-300 overflow-y-auto">
      <div className="flex flex-col gap-4 flex-grow">
        <div className="flex flex-row justify-around">
          <span className="font-bold text-2xl">Chấm công</span>
        </div>
        <CalendarContainer onSelect={(value) => setCurrentDate(value)} />
        <div className="w-full h-12 flex justify-center items-center border rounded-md bg-white">
          <button
            className="bg-blue-500 flex flex-row justify-center items-center gap-2
           hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-sm"
            onClick={() => setIsOpenModal(true)}
          >
            <AiFillPlusCircle />
            Tăng ca
          </button>
        </div>
        <MyTimeSheetStats
          month={currentDate.month() + 1}
          year={currentDate.year()}
        />
      </div>
      <footer className="bg-gray-200 mt-8 py-4 px-2 text-center text-gray-600"></footer>
      <Modal
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        footer={[
          <button
            onClick={() => setIsOpenModal(false)}
            className="w-24 ml-2 rounded-md h-8 bg-red-500 text-white cursor-pointer"
          >
            Hủy
          </button>,
          <button
            className="ml-2 w-24 rounded-md h-8 bg-blue-500 text-white cursor-pointer"
            onClick={() => handleCreateOvertime()}
          >
            Chấm công
          </button>,
        ]}
      >
        <OvertimeModal
          onSelectDate={(value) => setSelectedDate(value)}
          onSelectSession={(value) => setSelectedSession(value)}
        />
      </Modal>
    </div>
  );
};

export default TimeSheetPage;
