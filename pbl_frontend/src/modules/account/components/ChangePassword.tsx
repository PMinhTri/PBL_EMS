import React from "react";

const ChangePassword: React.FunctionComponent = () => {
  return (
    <div className="border-[2px] mx-2 rounded-md shadow-lg">
      <div className="flex flex-row pl-4 py-2 rounded-t-md items-center text-white text-lg bg-blue-600 font-bold">
        Đổi mật khẩu
      </div>
      <div className="p-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="currentPassword"
          >
            Mật khẩu hiện tại
          </label>
          <input
            id="currentPassword"
            type="password"
            required
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Nhập mật khẩu hiện tại"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="newPassword"
          >
            Mật khẩu mới
          </label>
          <input
            id="newPassword"
            type="password"
            required
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Nhập mật khẩu mới"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Xác nhận mật khẩu
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Xác nhận mật khẩu"
          />
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4
         rounded focus:outline-none focus:ring-2 focus:ring-blue-600">
          Đổi mật khẩu
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
