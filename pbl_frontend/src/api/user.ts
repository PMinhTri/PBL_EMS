import { UserDetailInformation } from "../types/userTypes";
import { $get } from "../utils/http";

export const getUserById = async (id: number) => {
  const response: {
    statusCode: number;
    payload: UserDetailInformation;
  } = await $get(`users/${id}`);
  return response;
};
