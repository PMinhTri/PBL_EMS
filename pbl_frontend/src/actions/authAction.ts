import { LoginAPI, changePassword, forgotPassword } from "../api/auth";
import { AuthPayload, ChangePasswordPayload } from "../types/authTypes";
import { handleError } from "../utils/errorHandler";
import showNotification from "../utils/notification";

export const AuthAction = {
  login: async (payload: AuthPayload) => {
    const response = await LoginAPI(payload);

    if (response.statusCode === 200) {
      const { token } = response.payload;

      localStorage.setItem("token", token);

      return {
        token: token,
        isAuthenticated: true,
      };
    }

    handleError(response);
  },
  logout: () => {
    localStorage.removeItem("token");
    return {
      token: "",
      isAuthenticated: false,
    };
  },
  changePassword: async (payload: ChangePasswordPayload) => {
    const response = await changePassword(payload);

    if (response.statusCode === 200) {
      const { payload } = response;
      return payload;
    }

    handleError(response);
  },

  fortgotPassword: async (email: string) => {
    const response = await forgotPassword(email);

    if (response.statusCode === 200) {
      const { payload } = response;
      showNotification("success", "Đã gửi thành công, hãy kiểm tra email!");
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 1000);
      return payload;
    }

    handleError(response);
  },
};
