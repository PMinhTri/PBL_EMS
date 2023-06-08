import React from "react";
import { UserDetailInformation } from "../../../../types/userTypes";
import { LeaveAction } from "../../../../actions/leaveAction";
import { LeaveBalance, LeaveType } from "../../../../types/leaveTypes";
import { BiEdit, BiReset } from "react-icons/bi";

const currentYears = Array.from(
  { length: 5 },
  (_, index) => new Date().getFullYear() + index
);

type Props = {
  employees: UserDetailInformation[];
};

const LeaveBalanceManagement: React.FunctionComponent<Props> = (
  props: Props
) => {
  const { employees } = props;

  const [selectedYear, setSelectedYear] = React.useState(
    new Date().getFullYear()
  );

  const [leaveBalance, setLeaveBalance] = React.useState<LeaveBalance[]>([]);

  const [leaveType, setLeaveType] = React.useState<LeaveType[]>([]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setLeaveBalance(await LeaveAction.getAllRemainingBalance(selectedYear));
      setLeaveType(await LeaveAction.getAllLeaveType());
    };

    fetchData();
  }, [selectedYear]);

  return (
    <div className="w-full mt-3 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Quản lý số lượng ngày phép</h2>
      <div className="mb-4">
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
      <div className="w-full">
        <div className="flex border-[2px] max-h-80 overflow-x-auto overflow-y-auto scrollbar">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-center border-b">Họ và tên</th>
                {leaveType.map((type) => (
                  <th className="py-3 px-4 text-center border-b">
                    Ngày nghỉ {type.name.toLowerCase()}
                  </th>
                ))}
                <th className="py-3 px-4 text-center border-b">Hàng động</th>
              </tr>
            </thead>
            <tbody>
              {leaveBalance.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 text-center border-b">
                    {
                      employees.find((employee) => employee.id === item.userId)
                        ?.fullName
                    }
                  </td>
                  {leaveType.map((type) => (
                    <td className="py-3 px-4 text-center border-b">
                      {`${
                        item.balance.find(
                          (balance) => balance.leaveTypeId === type.id
                        )?.remainingLeaveDays
                      }/${type.balance}`}
                    </td>
                  ))}

                  <td className="py-3 px-4 text-center border-b">
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

export default LeaveBalanceManagement;
