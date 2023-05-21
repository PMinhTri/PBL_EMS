import { getAllEmployees, getUserById } from "../api/user";
import { UserAuthInfo } from "../types/userTypes";
import { handleError } from "../utils/errorHandler";

export const UserAction = {
  getAuthInfo: (token: string): UserAuthInfo => {
    const base64Url = token?.split(".")[1];

    const decodeTokenData = base64Url ? JSON.parse(window.atob(base64Url)) : "";

    return decodeTokenData;
  },
  getUserInfo: async (id: number) => {
    const response = await getUserById(id);

    if (response.statusCode === 200) {
      const { payload } = response;
      return payload;
    }
  },

  getAllEmployees: async () => {
    const response = await getAllEmployees();

    const { payload } = response;
    return payload;
  },
};
