import { Role } from "../types/roleTypes";
import { $get, $post } from "../utils/http";

export const getAllRoles = async () => {
  const response: {
    statusCode: number;
    payload: Role[];
  } = await $get(`/role`);
  return response;
};

export const createRole = async (role: string) => {
  const response: {
    statusCode: number;
    payload: Role;
  } = await $post(`/role/add`, { role });
  return response;
};
