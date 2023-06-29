import React from "react";
import { TimeSheetAction } from "../../../actions/timeSheetAction";
import { UserDetailInformation } from "../../../types/userTypes";
import { UserAction } from "../../../actions/userAction";
import { LeaveAction } from "../../../actions/leaveAction";
import { LeaveRequest, LeaveStatus } from "../../../types/leaveTypes";
import { BiDollarCircle, BiEdit } from "react-icons/bi";
import { PayrollAction } from "../../../actions/payrollAction";
import { Payroll, PayrollPayload } from "../../../types/payrollTypes";
import { moneyFormat } from "../../../utils/format";
import { Modal } from "antd";
import PayrollModal from "./components/PayrollModal";
import { PayrollStatus } from "../../../constants/enum";
import Loading from "../../../components/Loading";
import dayjs from "dayjs";

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

  const [leaveRequests, setLeaveRequests] = React.useState<LeaveRequest[]>([]);
  const [allTotalWorkload, setAllTotalWorkload] = React.useState<
    {
      userId: string;
      totalWorkload: number;
    }[]
  >([]);
  const [allOvertimeSheets, setAllOvertimeSheets] = React.useState<
    {
      userId: string;
      totalOvertime: number;
    }[]
  >([]);

  const [openPayrollModal, setOpenPayrollModal] = React.useState<{
    user: UserDetailInformation;
    isOpen: boolean;
  }>({
    user: {} as UserDetailInformation,
    isOpen: false,
  });

  const [paidModal, setPaidModal] = React.useState<{
    user: UserDetailInformation;
    isOpen: boolean;
  }>({
    user: {} as UserDetailInformation,
    isOpen: false,
  });

  const [payrollList, setPayrollList] = React.useState<Payroll[]>([]);

  const [isCreating, setIsCreating] = React.useState(false);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(e.target.value));
  };

  const getTotalWorkload = (userId: string) => {
    return (
      allTotalWorkload.find((workload) => workload.userId === userId)
        ?.totalWorkload || 0
    );
  };

  const getOvertimes = (userId: string) => {
    return (
      allOvertimeSheets.find((overtime) => overtime.userId === userId)
        ?.totalOvertime || 0
    );
  };

  const handleCreatePayroll = React.useCallback(async () => {
    const newListPayroll: PayrollPayload[] = [];
    setIsCreating(true);
    for (const employee of employeeList) {
      newListPayroll.push({
        userId: employee.id,
        month: selectedMonth,
        year: selectedYear,
        basicSalary: 0,
        additional: 0,
        status: PayrollStatus.Unpaid,
      });
    }

    await PayrollAction.calculatePayrollForAllUser(newListPayroll);
  }, [employeeList, selectedMonth, selectedYear]);

  React.useEffect(() => {
    const fetchData = async () => {
      setEmployeeList(await UserAction.getAllEmployees());
      setLeaveRequests(
        await LeaveAction.getAllLeaveRequest(selectedMonth, selectedYear)
      );
      setAllTotalWorkload(
        await TimeSheetAction.getAllTotalWorkload(selectedMonth, selectedYear)
      );
      setAllOvertimeSheets(
        await TimeSheetAction.getAllTotalOvertime(selectedMonth, selectedYear)
      );
      setPayrollList(
        (await PayrollAction.getAllPayload(selectedMonth, selectedYear)) || []
      );
    };

    fetchData();
  }, [selectedMonth, selectedYear, handleCreatePayroll]);

  if (isCreating) {
    return (
      <div className="w-full h-full">
        <Loading />
      </div>
    );
  }

  const handlePaidSalary = async () => {
    const body: Partial<Omit<PayrollPayload, "userId">> = {
      month: selectedMonth,
      year: selectedYear,
      status: PayrollStatus.Paid,
    };

    await PayrollAction.updatedPayroll(
      payrollList.find((payload) => payload.userId === paidModal.user.id)?.id ||
        "",
      body
    );
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
      {!payrollList.length ? (
        <div className="w-full flex flex-col justify-center items-center gap-2">
          <div className="w-full flex justify-center items-center">
            <span className="font-bold text-xl">
              Chưa có dữ liệu bảng lương nào cho tháng {selectedMonth} năm
              {selectedYear}
            </span>
          </div>
          <div className="w-full flex justify-center items-center">
            <button
              className="p-2 border rounded-md bg-blue-500 hover:bg-blue-600"
              onClick={handleCreatePayroll}
            >
              <span className="text-white font-bold text-md">Tạo dữ liệu</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full border-2 p-6 rounded-md flex flex-col overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">Danh sách bảng lương</h2>

          <div className="w-full h-80 overflow-y-auto scrollbar">
            <table className="w-full border-collapse table-auto">
              <thead className="sticky top-0">
                <tr className="bg-slate-200 text-gray-600">
                  <th className="border border-gray-300 px-4 py-2">STT</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Họ và tên
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Ngày công
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Nghỉ phép
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Tăng ca</th>
                  <th className="border border-gray-300 px-4 py-2">Phụ cấp</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Lương cơ bản
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Trạng thái
                  </th>
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
                      {getTotalWorkload(employee.id)}
                    </td>
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
                      {getOvertimes(employee.id)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {payrollList.find(
                        (payroll) => payroll.userId === employee.id
                      )?.additional || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {payrollList.find(
                        (payroll) => payroll.userId === employee.id
                      )?.basicSalary || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {payrollList.find(
                        (payroll) => payroll.userId === employee.id
                      )?.status || "Chưa thanh toán"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {moneyFormat(
                        payrollList.find(
                          (payroll) => payroll.userId === employee.id
                        )?.totalSalary || 0
                      )}
                    </td>
                    <td className="py-3 px-4 text-center border-[2px]">
                      {payrollList.find(
                        (payroll) => payroll.userId === employee.id
                      )?.status === PayrollStatus.Unpaid && (
                        <div className="w-full flex flex-row gap-2 justify-center items-center">
                          <div
                            className="text-green-500 text-2xl hover:text-green-600 hover:cursor-pointer"
                            onClick={() =>
                              setOpenPayrollModal({
                                user: employee,
                                isOpen: true,
                              })
                            }
                          >
                            <BiEdit />
                          </div>
                          <div
                            className="text-yellow-500 text-2xl hover:text-yellow-600 hover:cursor-pointer"
                            onClick={() =>
                              setPaidModal({
                                user: employee,
                                isOpen: true,
                              })
                            }
                          >
                            <BiDollarCircle />
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Modal
        open={paidModal.isOpen}
        destroyOnClose={true}
        onCancel={() =>
          setPaidModal({ user: {} as UserDetailInformation, isOpen: false })
        }
        footer={
          <div className="w-full flex flex-row gap-2 justify-center items-center">
            <button
              className="p-2 w-24 border rounded-md bg-red-500 hover:bg-red-600"
              onClick={() =>
                setPaidModal({
                  user: {} as UserDetailInformation,
                  isOpen: false,
                })
              }
            >
              <span className="text-white font-bold text-md">Hủy</span>
            </button>
            <button
              className="p-2 w-24 border rounded-md bg-blue-500 hover:bg-blue-600"
              onClick={handlePaidSalary}
            >
              <span className="text-white font-bold text-md">Xác nhận</span>
            </button>
          </div>
        }
      >
        <div className="w-full flex flex-col justify-center items-center gap-2">
          <div className="w-full flex justify-center items-center">
            <span className="font-bold text-lg">Xác nhận thanh toán lương</span>
          </div>
        </div>
      </Modal>
      <Modal
        open={openPayrollModal.isOpen}
        onCancel={() =>
          setOpenPayrollModal({
            user: {} as UserDetailInformation,
            isOpen: false,
          })
        }
        destroyOnClose={true}
        footer={null}
      >
        <PayrollModal
          user={openPayrollModal.user}
          time={dayjs(`${selectedYear}-${selectedMonth}-01`).toDate()}
        />
        .
      </Modal>
    </div>
  );
};

export default PayrollManagement;
