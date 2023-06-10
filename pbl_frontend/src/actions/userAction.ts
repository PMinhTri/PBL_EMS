import {
  createNewUser,
  deleteUser,
  getAllEmployees,
  getUserById,
  updateUserInformation,
} from "../api/user";
import {
  CreateNewUserInformation,
  UserAuthInfo,
  UserDetailInformation,
} from "../types/userTypes";
import { handleError } from "../utils/errorHandler";

export const UserAction = {
  createNewUser: async (data: CreateNewUserInformation) => {
    const response = await createNewUser(data);

    if (response.statusCode === 200) {
      const { payload } = response;
      return payload;
    }

    handleError(response);
  },

  getAuthInfo: (token: string): UserAuthInfo => {
    const base64Url = token?.split(".")[1];

    const decodeTokenData = base64Url ? JSON.parse(window.atob(base64Url)) : "";

    return decodeTokenData;
  },
  getUserInfo: async (id: string) => {
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

  updateUserInfo: async (
    email: string,
    userInformation: UserDetailInformation
  ) => {
    const response = await updateUserInformation(email, userInformation);

    if (response.statusCode === 200) {
      const { payload } = response;
      return payload;
    }

    handleError(response);
  },

  deleteUser: async (id: string) => {
    const response = await deleteUser(id);

    if (response.statusCode === 200) {
      const { payload } = response;
      return payload;
    }

    handleError(response);
  },
};
