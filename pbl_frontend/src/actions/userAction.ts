import {
  createNewUser,
  deleteUser,
  getAllEmployees,
  getUserById,
  updateAvatar,
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

  getAllEmployees: async (query?: {
    search?: string;
    filter?: {
      gender?: string;
      departmentId?: string;
      jobTitleId?: string;
    };
  }) => {
    let queryParam = "";

    if (query?.search) {
      queryParam = `search=${query.search}`;
      if (query?.filter) {
        if (query?.filter.gender && query?.filter.gender !== "All") {
          queryParam += `&gender=${query.filter.gender}`;
        }
        if (
          query?.filter.departmentId &&
          query?.filter.departmentId !== "All"
        ) {
          queryParam += `&departmentId=${query.filter.departmentId}`;
        }
        if (query?.filter.jobTitleId && query?.filter.jobTitleId !== "All") {
          queryParam += `&jobTitleId=${query.filter.jobTitleId}`;
        }
      }
    }

    if (query?.filter && !query?.search) {
      if (query?.filter.gender && query?.filter.gender !== "All") {
        queryParam += `&gender=${query.filter.gender}`;
      }
      if (query?.filter.departmentId && query?.filter.departmentId !== "All") {
        queryParam += `&departmentId=${query.filter.departmentId}`;
      }
      if (query?.filter.jobTitleId && query?.filter.jobTitleId !== "All") {
        queryParam += `&jobTitleId=${query.filter.jobTitleId}`;
      }
    }

    const response = await getAllEmployees(queryParam);

    const { payload } = response;
    return payload;
  },

  updateUserInfo: async (
    id: string,
    userInformation: Partial<UserDetailInformation>
  ) => {
    const response = await updateUserInformation(id, userInformation);

    if (response.statusCode === 200) {
      const { payload } = response;
      return payload;
    }

    handleError(response);
  },

  updateAvatar: async (id: string, avatarUrl: string) => {
    const response = await updateAvatar(id, avatarUrl);

    if (response.statusCode === 200) {
      const { payload } = response;
      return payload;
    }

    handleError(response);
  },

  deleteAvatar: async (id: string) => {
    const response = await deleteUser(id);

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
