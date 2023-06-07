import React from "react";

const HistoryTimeSheet: React.FunctionComponent = () => {
  return (
    <div className="w-full p-4 bg-white border rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-bold">Lịch sử chấm công</div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Filter
        </button>
      </div>
      <div></div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Ngày</th>
            <th className="py-2 px-4">Ca</th>
            <th className="py-2 px-4">Thời gian</th>
            <th className="py-2 px-4">Trạng thái</th>
          </tr>
        </thead>
        <tbody>{/* Table rows go here */}</tbody>
      </table>
    </div>
  );
};

export default HistoryTimeSheet;
