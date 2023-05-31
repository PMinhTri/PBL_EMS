import { DatePicker, Input, Select } from "antd";
import React from "react";

const JobInformation: React.FunctionComponent = () => {
  return (
    <>
      <div className="border-[2px] mx-2 rounded-md shadow-lg">
        <div className="flex flex-row pl-4 py-2 rounded-t-md items-center text-white text-lg bg-blue-600 font-bold">
          Thông tin công việc
        </div>
        <div className="grid grid-cols-2">
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Mã nhân viên:</div>
            <Input className="w-full" allowClear />
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Ngày vào:</div>
            <DatePicker className="w-full" />
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Trạng thái:</div>
            <Select className="w-full" />
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Chức vụ:</div>
            <Select className="w-full" />
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Loại hợp đồng:</div>
            <Select className="w-full" />
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Chi nhánh:</div>
            <Select className="w-full" />
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Kỹ năng:</div>
            <Select mode="multiple" className="w-full" />
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Dự án:</div>
            <Select className="w-full" />
          </div>
        </div>
        <div className="w-full flex flex-row justify-end">
          <button
            className="m-4 w-24 h-8 rounded-sm border-[1px] bg-blue-600 text-white 
                  justify-end hover:text-blue-600 hover:bg-white hover:border-blue-600"
          >
            Cập nhật
          </button>
        </div>
      </div>
      <div className="border-[2px] mt-4 mx-2 rounded-md shadow-lg">
        <div className="flex flex-row pl-4 py-2 rounded-t-md items-center text-white text-lg bg-blue-600 font-bold">
          Thông tin hợp đồng
        </div>
        <div className="grid grid-cols-2">
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Loại hợp đồng:</div>
            <Input className="w-full" allowClear />
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Ngày ký:</div>
            <DatePicker className="w-full" />
          </div>
          <div className="flex flex-row items-center m-2">
            <div className="m-2 w-36 font-bold">Ngày kết thúc:</div>
            <DatePicker className="w-full" />
          </div>
        </div>
        <div className="w-full flex flex-row justify-end">
          <button
            className="m-4 w-24 h-8 rounded-sm border-[1px] bg-blue-600 text-white 
                  justify-end hover:text-blue-600 hover:bg-white hover:border-blue-600"
          >
            Cập nhật
          </button>
        </div>
      </div>
    </>
  );
};

export default JobInformation;
