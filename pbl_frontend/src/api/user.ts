import {
  CreateNewUserInformation,
  UpdateUserInformation,
  UserDetailInformation,
} from "../types/userTypes";
import { $get, $post } from "../utils/http";

export const createNewUser = async (data: CreateNewUserInformation) => {
  const response: {
    statusCode: number;
    payload: UserDetailInformation;
  } = await $post(`/users/create`, data);
  return response;
};

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
