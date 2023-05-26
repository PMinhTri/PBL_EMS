import {
  createNewUser,
  getAllEmployees,
  getUserById,
  updateUserInformation,
} from "../api/user";
import {
  CreateNewUserInformation,
  UpdateUserInformation,
  UserAuthInfo,
} from "../types/userTypes";
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

  createNewUser: async (data: CreateNewUserInformation) => {
    const response = await createNewUser(data);

    if (response.statusCode === 200) {
      const { payload } = response;
      return payload;
    }

    handleError(response);
  },

  updateUserInfo: async (data: UpdateUserInformation) => {
    const response = await updateUserInformation(data);

    if (response.statusCode === 200) {
      const { payload } = response;
      return payload;
    }

    handleError(response);
  },
};
