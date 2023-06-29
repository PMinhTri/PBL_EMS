import React from "react";
import { AuthAction } from "../../actions/authAction";

const ForgotPassword: React.FunctionComponent = () => {
  const [textChange, setTextChange] = React.useState<string>("");

  const handleSubmit = async () => {
    await AuthAction.fortgotPassword(textChange);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#fbfbfb]">
      <div className="p-8 border rounded-md justify-center items-center shadow-md">
        <div className="grid w-80 grid-rows-4 gap-1">
          <p className="font-semibold text-gray-700">
            💌 Mật khẩu mới sẽ được gửi đến email. Vui lòng nhập email của bạn
          </p>
          <input
            type="text"
            className="h-10 w-full rounded border p-2 text-sm"
            placeholder="Nhập email..."
            onChange={(e) => setTextChange(e.target.value)}
          />
          <button
            className="rounded bg-blue-500 text-gray-50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600"
            onClick={handleSubmit}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
