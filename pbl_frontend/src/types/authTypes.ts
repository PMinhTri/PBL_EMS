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

export type AuthState = {
  token: string;
  isAuthenticated: boolean;
};

export type ChangePasswordPayload = {
  email: string;
  oldPassword: string;
  password: string;
  confirmPassword: string;
};
