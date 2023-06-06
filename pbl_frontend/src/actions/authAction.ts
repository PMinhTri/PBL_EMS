import { LoginAPI, changePassword } from "../api/auth";
import { AuthPayload, ChangePasswordPayload } from "../types/authTypes";
import { handleError } from "../utils/errorHandler";

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
};
