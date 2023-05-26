import {
  CreateNewUserInformation,
  UpdateUserInformation,
  UserDetailInformation,
} from "../types/userTypes";
import { $get, $post } from "../utils/http";

export const getUserById = async (id: number) => {
  const response: {
    statusCode: number;
    payload: UserDetailInformation;
  } = await $get(`/users/${id}`);
  return response;
};

export const getAllEmployees = async () => {
  const response: {
    statusCode: number;
    payload: UserDetailInformation[];
  } = await $get(`/users`);
  return response;
};

export const createNewUser = async (data: CreateNewUserInformation) => {
  const response: {
    statusCode: number;
    payload: UserDetailInformation[];
  } = await $post(`/users/create`, {
    data,
  });

  return response;
};

export const updateUserInformation = async (data: UpdateUserInformation) => {
  const response: {
    statusCode: number;
    payload: UserDetailInformation[];
  } = await $post(`/users/update-personal-information`, {
    data,
  });

  return response;
};
