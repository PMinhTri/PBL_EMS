import React from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import { emailRegex } from "../../utils/email";
import { AuthAction } from "../../actions/authAction";
import { useSetRecoilState } from "recoil";
import { authState } from "../../recoil/atoms/auth";
import showNotification from "../../utils/notification";
import { Button } from "antd";

const LoginPage: React.FunctionComponent = () => {
  const setAuth = useSetRecoilState(authState);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [error, setError] = React.useState({
    emailError: false,
    passwordError: false,
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const onLogin = async () => {
    setError({
      emailError: !emailRegex.test(email),
      passwordError: !password,
    });

    if (!email || !password) {
      showNotification("error", "Email hoặc mật khẩu không chính xác");
      return;
    }

    if (Object.values(error).some((err) => err)) {
      showNotification("error", "Vui lòng điền tất cả các trường");
      return;
    }

    const data = await AuthAction.login({ email, password });

    if (data?.token) {
      setAuth((prev) => {
        return {
          ...prev,
          token: data.token,
          isAuthenticated: data.isAuthenticated,
        };
      });

      setLoading(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-300">
      <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
        <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">
          Đăng nhập
        </div>
        <div className="mt-10">
          <form action="#">
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                Email:
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <FaRegEnvelope />
                </div>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                  placeholder="Email"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(event.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onLogin();
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                Mật khẩu:
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <span>
                    <FiLock />
                  </span>
                </div>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                  placeholder="Mật khẩu"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(event.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onLogin();
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex items-center mb-6 -mt-4">
              <div className="flex ml-auto">
                <a
                  href="forgot-password"
                  className="inline-flex text-xs sm:text-sm text-blue-500 hover:text-blue-700"
                >
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div className="flex w-full ">
              <Button
                onClick={onLogin}
                className="flex items-center justify-center w-full h-10 focus:outline-none text-white text-sm bg-blue-600 hover:bg-blue-700 rounded py-2 transition duration-150 ease-in"
                loading={loading}
              >
                <span className="mr-2 uppercase">Đăng nhập</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
