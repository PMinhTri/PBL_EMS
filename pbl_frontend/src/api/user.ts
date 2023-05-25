import {
  CreateNewUserInformation,
  UserDetailInformation,
} from "../types/userTypes";
import { $get, $post } from "../utils/http";

export const getUserById = async (id: number) => {
  const response: {
    statusCode: number;
    payload: UserDetailInformation;
  } = await $get(`users/${id}`);
  return response;
};

export const getAllEmployees = async () => {
  const response: {
    statusCode: number;
    payload: UserDetailInformation[];
  } = await $get(`users`);
  return response;
};

export const createNewUser = async (data: CreateNewUserInformation) => {
  const response: {
    statusCode: number;
    payload: UserDetailInformation[];
  } = await $post(`users/create`, {
    data,
  });
  return response;
};
