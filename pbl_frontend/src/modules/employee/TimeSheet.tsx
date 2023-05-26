import React from "react";

const TimeSheetPage: React.FunctionComponent = () => {
  const year = new Date().getFullYear();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysInMonth = new Array(12)
    .fill(0)
    .map((_, monthIndex) => new Date(year, monthIndex + 1, 0).getDate());

  return (
    <div className="flex flex-col w-full items-center overflow-x-auto">
      <h1 className="text-2xl font-bold mt-6 mb-8">Timesheet</h1>

      <div className="bg-white rounded shadow-lg w-96 p-6">
        <form>
          <table className="w-full mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4">Month</th>
                {Array.from({ length: 31 }, (_, index) => index + 1).map(
                  (day) => (
                    <th key={day} className="py-2 px-4">
                      {day}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {months.map((month, monthIndex) => (
                <tr key={month}>
                  <td className="py-2 px-4 font-semibold">{month}</td>
                  {Array.from(
                    { length: daysInMonth[monthIndex] },
                    (_, index) => index + 1
                  ).map((day) => (
                    <td key={day} className="border">
                      <input
                        type="text"
                        className="w-full border-none py-1 px-2 text-center focus:outline-none bg-gray-100 rounded"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            Check-in
          </button>
        </form>
      </div>
    </div>
  );
};

export default TimeSheetPage;
