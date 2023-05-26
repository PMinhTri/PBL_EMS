import { Role } from "../types/roleTypes";
import { $get } from "../utils/http";

export const getAllRoles = async () => {
  const response: {
    statusCode: number;
    payload: Role[];
  } = await $get(`/role`);
  return response;
};
