export enum AuthType {
  LOGIN_REQUEST = "auth/loginRequest",
  LOGIN_SUCCESS = "auth/loginSuccess",
  LOGIN_FAILED = "auth/loginFailed",
  LOGOUT = "auth/logout",
}

export interface AuthPayload {
  email: string;
  password: string;
}

export type AuthResponse = {
  statusCode: number;
  payload: {
    token: string;
  };
};
