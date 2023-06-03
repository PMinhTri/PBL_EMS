import React from "react";

const PayrollTable: React.FunctionComponent = () => {
  return (
    <div className="w-full border-2 p-6 rounded-md flex flex-col overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Danh sách bảng lương</h2>

      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="border border-gray-300 px-4 py-2">STT</th>
            <th className="border border-gray-300 px-4 py-2">Họ và tên</th>
            <th className="border border-gray-300 px-4 py-2">Ngày công</th>
            <th className="border border-gray-300 px-4 py-2">Ngày nghỉ</th>
            <th className="border border-gray-300 px-4 py-2">Có phép</th>
            <th className="border border-gray-300 px-4 py-2">Tăng ca</th>
            <th className="border border-gray-300 px-4 py-2">Phụ cấp</th>
            <th className="border border-gray-300 px-4 py-2">Ứng lương</th>
            <th className="border border-gray-300 px-4 py-2">Hệ số</th>
            <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
            <th className="border border-gray-300 px-4 py-2">Lương</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="border border-gray-300 px-4 py-2">1</td>
            <td className="border border-gray-300 px-4 py-2">
              Phan Đình Minh Trí
            </td>
            <td className="border border-gray-300 px-4 py-2">25</td>
            <td className="border border-gray-300 px-4 py-2">1</td>
            <td className="border border-gray-300 px-4 py-2">1</td>
            <td className="border border-gray-300 px-4 py-2">0</td>
            <td className="border border-gray-300 px-4 py-2">0</td>
            <td className="border border-gray-300 px-4 py-2">0</td>
            <td className="border border-gray-300 px-4 py-2">1.0</td>
            <td className="border border-gray-300 px-4 py-2">Đã duyệt</td>
            <td className="border border-gray-300 px-4 py-2">5.500.000đ</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PayrollTable;
