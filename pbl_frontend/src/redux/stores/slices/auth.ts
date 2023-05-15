import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthPayload, AuthResponse } from "../../../types/authTypes";
import { UserInformation } from "../../../types/userTypes";
import { handleError } from "../../../utils/errorHandler";

export interface AuthState {
  token: string | null;
  payload?: AuthPayload;
  isLoading: boolean;
  isAuthenticated: boolean;
  logging: boolean;
  userInfo: UserInformation;
  error: unknown | null;
}

const initialState: AuthState = {
  token: "",
  payload: {
    email: "",
    password: "",
  },
  isLoading: false,
  isAuthenticated: false,
  userInfo: {
    id: 0,
    email: "",
    fullName: "",
    role: "",
  },
  logging: false,
  error: null,
};

const getUserInformation = (token: string): UserInformation => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  const userInformation = JSON.parse(window.atob(base64));
  return userInformation;
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state, action: PayloadAction<AuthPayload>) => {
      state.payload = action.payload;
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      const {
        payload: { token },
      } = action.payload;
      localStorage.setItem("token", token);
      state.userInfo = getUserInformation(token);
      state.token = token;
      state.isLoading = false;
      state.error = null;
      if (localStorage.getItem("token")) {
        window.location.href = "/admin/dashboard";
      }
    },
    loginFailed: (state, action: PayloadAction<unknown>) => {
      handleError(action.payload);
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailed, logout } =
  authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
