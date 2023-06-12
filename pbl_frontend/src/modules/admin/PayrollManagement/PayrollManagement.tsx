import React from "react";
import { TimeSheetAction } from "../../../actions/timeSheetAction";
import { TimeSheet } from "../../../types/timeSheet";
import { UserDetailInformation } from "../../../types/userTypes";
import { UserAction } from "../../../actions/userAction";
import { LeaveAction } from "../../../actions/leaveAction";
import { LeaveRequest, LeaveStatus } from "../../../types/leaveTypes";
import { BiEdit, BiReset } from "react-icons/bi";

const currentYears = Array.from(
  { length: 5 },
  (_, index) => new Date().getFullYear() + index
);

const PayrollManagement: React.FunctionComponent = () => {
  const [selectedYear, setSelectedYear] = React.useState(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = React.useState(
    new Date().getMonth() + 1
  );
  const [employeeList, setEmployeeList] = React.useState<
    UserDetailInformation[]
  >([]);

  const [timeSheets, setTimeSheets] = React.useState<TimeSheet[]>([]);

  const [leaveRequests, setLeaveRequests] = React.useState<LeaveRequest[]>([]);
  const [allOvertimeSheets, setAllOvertimeSheets] = React.useState<TimeSheet[]>(
    []
  );

  React.useEffect(() => {
    const fetchData = async () => {
      setEmployeeList(await UserAction.getAllEmployees());
      setTimeSheets(
        await TimeSheetAction.getAllInMonth(selectedMonth, selectedYear)
      );
      setLeaveRequests(
        await LeaveAction.getAllLeaveRequest(selectedMonth, selectedYear)
      );
      setAllOvertimeSheets(
        await TimeSheetAction.getAllOvertimeWorkload(
          selectedMonth,
          selectedYear
        )
      );
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(e.target.value));
  };

  return (
    <div className="w-full p-4 gap-2 flex flex-col overflow-auto">
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
      <div className="w-full border-2 p-6 rounded-md flex flex-col overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Danh sách bảng lương</h2>

        <div className="w-full h-80 overflow-y-auto scrollbar">
          <table className="w-full border-collapse table-auto">
            <thead className="sticky top-0">
              <tr className="bg-slate-200 text-gray-600">
                <th className="border border-gray-300 px-4 py-2">STT</th>
                <th className="border border-gray-300 px-4 py-2">Họ và tên</th>
                <th className="border border-gray-300 px-4 py-2">Ngày công</th>
                <th className="border border-gray-300 px-4 py-2">Nghỉ phép</th>
                <th className="border border-gray-300 px-4 py-2">Tăng ca</th>
                <th className="border border-gray-300 px-4 py-2">Phụ cấp</th>
                <th className="border border-gray-300 px-4 py-2">Hệ số</th>
                <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
                <th className="border border-gray-300 px-4 py-2">Lương</th>
                <th className="border border-gray-300 px-4 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {employeeList.map((employee, index) => (
                <tr className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {employee.fullName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {(timeSheets.find(
                      (timeSheet) => timeSheet.userId === employee.id
                    )?.hoursWorked || 0) / 8}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">1</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {leaveRequests
                      .filter(
                        (leaveRequest) =>
                          leaveRequest.userId === employee.id &&
                          leaveRequest.status === LeaveStatus.Approved
                      )
                      .reduce(
                        (acc, leaveRequest) => acc + leaveRequest.leaveDays,
                        0
                      )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {
                      allOvertimeSheets.filter(
                        (overtimeSheet) =>
                          overtimeSheet.userId === employee.id &&
                          overtimeSheet.status === "Đã chấm công"
                      ).length
                    }
                  </td>
                  <td className="border border-gray-300 px-4 py-2">0</td>
                  <td className="border border-gray-300 px-4 py-2">Đã duyệt</td>
                  <td className="border border-gray-300 px-4 py-2">
                    5.500.000đ
                  </td>
                  <td className="py-3 px-4 text-center border-[2px]">
                    <div className="w-full flex flex-row gap-2 justify-center items-center">
                      <div className="text-green-500 text-2xl hover:text-green-600 hover:cursor-pointer">
                        <BiEdit />
                      </div>
                      <div className="text-slate-500 text-2xl hover:text-slate-600 hover:cursor-pointer">
                        <BiReset />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollManagement;
