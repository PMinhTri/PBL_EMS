import React from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import showNotification from "../../../utils/notification";
import { AuthAction } from "../../../actions/authAction";
import { useRecoilValue } from "recoil";
import userSelector from "../../../recoil/selectors/user";

const ChangePassword: React.FunctionComponent = () => {
  const { userAuthInfo } = useRecoilValue(userSelector);
  const [currentPassword, setCurrentPassword] = React.useState<string>("");
  const [newPassword, setNewPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] =
    React.useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState<boolean>(false);

  const toggleShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChangePassword = async () => {
    await AuthAction.changePassword({
      email: userAuthInfo.email,
      oldPassword: currentPassword,
      password: newPassword,
      confirmPassword: confirmPassword,
    });
  };

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
          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              required
              onChange={(e) => {
                setCurrentPassword(e.target.value);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Nhập mật khẩu hiện tại"
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={toggleShowCurrentPassword}
            >
              {showCurrentPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="newPassword"
          >
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              required
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Nhập mật khẩu mới"
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={toggleShowNewPassword}
            >
              {showNewPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Xác nhận mật khẩu"
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={toggleShowConfirmPassword}
            >
              {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </button>
          </div>
        </div>
        <button
          onClick={() => {
            if (newPassword !== confirmPassword) {
              showNotification("warning", "Mật khẩu mới không khớp");
              return;
            }
            handleChangePassword()
              .then(() => {
                showNotification("success", "Đổi mật khẩu thành công");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              })
              .catch(() => {
                showNotification("error", "Đổi mật khẩu thất bại");
              });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4
         rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Đổi mật khẩu
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
