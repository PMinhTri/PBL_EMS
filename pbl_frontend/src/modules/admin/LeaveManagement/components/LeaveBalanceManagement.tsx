import React from "react";

type LeaveBalanceItem = {
  id: number;
  userName: string;
  leaveDaysTaken: number;
  remaining: number;
};

const leaveBalanceData: LeaveBalanceItem[] = [
  {
    id: 1,
    userName: "John Doe",
    leaveDaysTaken: 10,
    remaining: 20,
  },
  {
    id: 2,
    userName: "Jane Smith",
    leaveDaysTaken: 5,
    remaining: 15,
  },
  // Add more leave balance data objects as needed
];

const LeaveBalance: React.FunctionComponent = () => {
  const [selectedMonth, setSelectedMonth] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState("");

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div className="w-full mt-3 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Leave Balance</h2>
      <div className="flex justify-start mb-4">
        <div>
          <label className="mr-2">Month:</label>
          <select
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            <option value="">Select Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            {/* Add more months as needed */}
          </select>
        </div>
        <div>
          <label className="mx-2">Year:</label>
          <select
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={selectedYear}
            onChange={handleYearChange}
          >
            <option value="">Select Year</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-center border-b">ID</th>
            <th className="py-3 px-4 text-center border-b">User Name</th>
            <th className="py-3 px-4 text-center border-b">Leave Days Taken</th>
            <th className="py-3 px-4 text-center border-b">Remaining</th>
            <th className="py-3 px-4 text-center border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {leaveBalanceData.map((item, index) => (
            <tr key={index}>
              <td className="py-3 px-4 text-center border-b">{item.id}</td>
              <td className="py-3 px-4 text-center border-b">
                {item.userName}
              </td>
              <td className="py-3 px-4 text-center border-b">
                {item.leaveDaysTaken}
              </td>
              <td className="py-3 px-4 text-center border-b">
                {item.remaining}
              </td>
              <td className="py-3 px-4 text-center border-b">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveBalance;
