import React from "react";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import { UserAction } from "../../../../actions/userAction";
import { UserDetailInformation } from "../../../../types/userTypes";
import { TimeSheet } from "../../../../types/timeSheet";
import { TimeSheetAction } from "../../../../actions/timeSheetAction";
import { useRecoilValue } from "recoil";
import userSelector from "../../../../recoil/selectors/user";

const TimeSheetTable: React.FunctionComponent = () => {
  const { userAuthInfo } = useRecoilValue(userSelector);
  const [selectedYear, setSelectedYear] = React.useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = React.useState<number>(
    new Date().getMonth() + 1
  );
  const [employeeList, setEmployeeList] = React.useState<
    UserDetailInformation[]
  >([]);
  const [totalWorkLoad, setTotalWorkLoad] = React.useState<number[]>([]);

  const [timeSheet, setTimeSheet] = React.useState<TimeSheet[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const employees = await UserAction.getAllEmployees();
      setTimeSheet(
        await TimeSheetAction.getAllInMonth(selectedMonth, selectedYear)
      );
      setEmployeeList(employees);
    };

    fetchData();
  }, [selectedMonth, selectedYear, userAuthInfo.id]);

  const generateDaysArray = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => index + 1);
  };

  const getWorkLoadValue = (userId: string, day: number) => {
    const value = timeSheet.find(
      (timeSheet) => timeSheet.userId === userId && timeSheet.date === day
    )?.hoursWorked;

    return value ? value / 8 : 0;
  };

  const daysOfWeek = ["CN", "Th.2", "Th.3", "Th.4", "Th.5", "Th.6", "Th.7"];

  return (
    <div className="w-full p-6 rounded-md flex flex-col bg-white">
      <h2 className="text-2xl font-bold mb-4">Bảng công</h2>

      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          <div className="flex items-center mb-4">
            <label className="mr-2">Năm:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              {/* Add more years as needed */}
            </select>
          </div>

          <div className="flex items-center mb-4">
            <label className="mr-2">Tháng:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1"
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
        <div>
          <button className="bg-blue-600 flex flex-row items-center gap-2 text-white px-4 py-2 rounded-md">
            <BsFillArrowDownCircleFill />
            <div>Xuất bảng</div>
          </button>
        </div>
      </div>

      <div className="flex w-full h-[560px] border border-slate-400 rounded-md flex-col overflow-x-auto overflow-y-auto scrollbar">
        <div className="flex w-full h-1/6 sticky top-0 z-20">
          <div className="flex flex-row sticky bg-slate-200 border-r border-slate-400 left-0 top-0 z-20">
            <div className="flex border-b border-r border-slate-400 w-8 text-md font-bold justify-center items-center">
              STT
            </div>
            <div className="flex border-b border-slate-400 w-48 text-md font-bold justify-center items-center">
              Họ và tên
            </div>
          </div>
          <div className="flex flex-row border-b border-slate-400 bg-white z-10">
            {generateDaysArray().map((day) => {
              const date = new Date(selectedYear, selectedMonth - 1, day);
              const dayOfWeek = date.getDay();
              let dayClass =
                "flex flex-col gap-4 border w-12 justify-center items-center";

              if (dayOfWeek === 0) {
                // Sunday (CN) - Apply purple color
                dayClass += " bg-blue-300";
              } else if (dayOfWeek === 6) {
                // Saturday (Th.7) - Apply blue color
                dayClass += " bg-blue-300";
              } else {
                dayClass += " bg-white";
              }

              return (
                <div key={day} className={dayClass}>
                  <span className="text-md font-bold">{day}</span>
                  <div>
                    <span className="text-md font-bold">
                      {daysOfWeek[dayOfWeek]}
                    </span>
                  </div>
                </div>
              );
            })}
            <div className="flex border w-28 justify-center items-center text-md font-bold">
              Số ngày công
            </div>
            <div className="flex border w-28 justify-center items-center text-md font-bold">
              Số ngày nghỉ
            </div>
            <div className="flex border w-28 justify-center items-center text-md font-bold">
              Tăng ca
            </div>
            <div className="flex border w-28 justify-center items-center text-md font-bold">
              Thao tác
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full h-5/6">
          {employeeList.map((employee, index) => (
            <div key={employee.id} className="flex w-full h-16">
              <div className="flex flex-row sticky bg-white border-r border-slate-400 left-0 z-10">
                <div className="flex border w-8 justify-center items-center">
                  {index}
                </div>
                <div className="flex border w-48 justify-center items-center">
                  {employee.fullName}
                </div>
              </div>
              <div className="flex flex-row z-1">
                {generateDaysArray().map((day) => {
                  const date = new Date(selectedYear, selectedMonth - 1, day);
                  const dayOfWeek = date.getDay();
                  let inputClass =
                    "flex border w-12 justify-center items-center";

                  if (dayOfWeek === 0) {
                    // Sunday (CN) - Apply specific styles
                    inputClass += " bg-blue-300";
                  } else if (dayOfWeek === 6) {
                    // Saturday (Th.7) - Apply specific styles
                    inputClass += " bg-blue-300";
                  }

                  return (
                    <div key={day} className={inputClass}>
                      {getWorkLoadValue(employee.id, day)}
                    </div>
                  );
                })}
                <div className="flex border w-28 justify-center items-center">
                  {/* Add input fields here */}
                </div>
                <div className="flex border w-28 justify-center items-center">
                  {/* Add input fields here */}
                </div>
                <div className="flex border w-28 justify-center items-center">
                  {/* Add input fields here */}
                </div>
                <div className="flex border w-28 justify-center items-center">
                  {/* Add input fields here */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeSheetTable;
