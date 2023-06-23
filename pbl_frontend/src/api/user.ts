import {
  CreateNewUserInformation,
  UserDetailInformation,
  UserResponse,
} from "../types/userTypes";
import { $delete, $get, $patch, $post } from "../utils/http";

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

export const getAllEmployees = async (query?: string) => {
  const response: {
    statusCode: number;
    payload: UserDetailInformation[];
  } = query ? await $get(`/users?${query}`) : await $get(`/users`);
  return response;
};

export const updateUserInformation = async (
  id: string,
  userInformation: Partial<UserDetailInformation>
) => {
  const response: {
    statusCode: number;
    payload: UserDetailInformation;
  } = await $patch(`/users/${id}/update-personal-information`, {
    ...userInformation,
  });

  return response;
};

export const updateAvatar = async (id: string, avatarUrl: string) => {
  const response: {
    statusCode: number;
    payload: UserDetailInformation;
  } = await $patch(`/users/${id}/update-avatar`, { avatar: avatarUrl });

  return response;
};

export const deleteAvatar = async (id: string) => {
  const response: {
    statusCode: number;
    payload: UserDetailInformation;
  } = await $delete(`/users/${id}/delete-avatar`);

  return response;
};

export const deleteUser = async (id: string) => {
  const response: {
    statusCode: number;
    payload: UserDetailInformation;
  } = await $delete(`/users/${id}`);

  return response;
};
