import {
  CreateNewUserInformation,
  UpdateUserInformation,
  UserDetailInformation,
  UserResponse,
} from "../types/userTypes";
import { $delete, $get, $post } from "../utils/http";

export const createNewUser = async (data: CreateNewUserInformation) => {
  const response: {
    statusCode: number;
    payload: { user: UserResponse; password: string };
  } = await $post(`/users/create`, data);
  return response;
};

export const getUserById = async (id: string) => {
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

export const updateUserInformation = async (
  email: string,
  userInformation: UpdateUserInformation
) => {
  const response: {
    statusCode: number;
    payload: UserDetailInformation[];
  } = await $post(`/users/update-personal-information`, {
    email: email,
    userInformation: userInformation,
  });

  return response;
};

export const deleteUser = async (id: string) => {
  const response: {
    statusCode: number;
    payload: UserDetailInformation[];
  } = await $delete(`/users/${id}`);

  return response;
};
