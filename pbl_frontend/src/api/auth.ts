import {
  AuthPayload,
  AuthResponse,
  ChangePasswordPayload,
} from "../types/authTypes";
import { $post } from "../utils/http";

export const LoginAPI = async (payload: AuthPayload) => {
  const response: AuthResponse = await $post("/auth/login", {
    email: payload.email,
    password: payload.password,
  });

  return response;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const response: AuthResponse = await $post("/auth/change-password", {
    email: payload.email,
    oldPassword: payload.oldPassword,
    password: payload.password,
    confirmPassword: payload.confirmPassword,
  });

  return response;
};

export const forgotPassword = async (email: string) => {
  const response: AuthResponse = await $post("/auth/forgot-password", {
    email,
  });

  return response;
};
