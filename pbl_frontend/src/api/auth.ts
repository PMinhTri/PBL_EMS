import { AuthPayload, AuthResponse } from "../types/authTypes";
import { $post } from "../utils/http";

export const Login = async (payload: AuthPayload) => {
  const response: AuthResponse = await $post("/auth/login", {
    email: payload.email,
    password: payload.password,
  });

  return response;
};
