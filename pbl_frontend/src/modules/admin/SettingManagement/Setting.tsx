import { Select } from "antd";
import React from "react";

const Setting: React.FunctionComponent = () => {
  return (
    <div className="w-full p-4 border shadow-md overflow-y-auto">
      <div className="flex flex-col">
        <div className="text-2xl font-bold mb-4">Thiết lập</div>
        <div className="p-4 w-full h-28 border gap-8 flex flex-row rounded-md justify-between items-center">
          <div className="w-1/3 text-lg font-bold text-gray-600">Vai trò</div>
          <div className="w-1/3 flex flex-col gap-4">
            <div className="w-full flex flex-row">
              <input
                type="text"
                className="w-full px-2 py-1 border rounded"
                placeholder="Tạo mới"
              />
              <button
                className="
                w-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-2"
              >
                Tạo
              </button>
            </div>
            <div className="w-full flex flex-row">
              <Select className="w-full" />
              <button
                className="
                w-20 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2"
              >
                Sửa
              </button>
            </div>
          </div>
          <div className="w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
