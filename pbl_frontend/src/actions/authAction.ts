import { LoginAPI } from "../api/auth";
import { AuthPayload } from "../types/authTypes";
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
};
