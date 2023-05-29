import React from "react";

type RequestHistoryItem = {
  startDate: string;
  endDate: string;
  leaveDays: number;
  session: string;
  reason: string;
  status: string;
};

const requestHistoryData: RequestHistoryItem[] = [
  {
    startDate: "2023-05-01",
    endDate: "2023-05-03",
    leaveDays: 3,
    session: "Morning",
    reason: "Family event",
    status: "Approved",
  },
  {
    startDate: "2023-06-10",
    endDate: "2023-06-15",
    leaveDays: 6,
    session: "Full Day",
    reason: "Vacation",
    status: "Pending",
  },
  // Add more request history data objects as needed
];

const RequestHistory: React.FunctionComponent = () => {
  return (
    <div className="w-full mt-3 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Request History</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-center border-b">Start Date</th>
            <th className="py-3 px-4 text-center border-b">End Date</th>
            <th className="py-3 px-4 text-center border-b">Leave Days</th>
            <th className="py-3 px-4 text-center border-b">Session</th>
            <th className="py-3 px-4 text-center border-b">Reason</th>
            <th className="py-3 px-4 text-center border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {requestHistoryData.map((item, index) => (
            <tr key={index}>
              <td className="py-3 px-4 text-center border-b">
                {item.startDate}
              </td>
              <td className="py-3 px-4 text-center border-b">{item.endDate}</td>
              <td className="py-3 px-4 text-center border-b">
                {item.leaveDays}
              </td>
              <td className="py-3 px-4 text-center border-b">{item.session}</td>
              <td className="py-3 px-4 text-center border-b">{item.reason}</td>
              <td className="py-3 px-4 text-center border-b">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestHistory;
