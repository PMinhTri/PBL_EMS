import React from "react";
import PayrollTable from "./components/PayrollTable";

const PayrollManagement: React.FunctionComponent = () => {
  return (
    <div className="w-full p-4 gap-2 flex flex-col overflow-auto">
      <div className="w-full h-12 gap-2 flex flex-row">
        <div className="flex flex-row items-center">
          <label className="mr-2 text-lg">Năm</label>
          <select
            value={2023}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="{2023}">2023</option>
            <option value="{2024}">2024</option>
          </select>
        </div>
        <div className="flex flex-row items-center">
          <label className="mr-2 text-lg">Tháng</label>
          <select
            value={2023}
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

      <PayrollTable />
    </div>
  );
};

export default PayrollManagement;
