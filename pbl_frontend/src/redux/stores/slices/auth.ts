import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthPayload, AuthResponse } from "../../../types/authTypes";
import { UserInformation } from "../../../types/userTypes";
import { handleError } from "../../../utils/errorHandler";

export interface AuthState {
  token: string | null;
  userInfo: UserInformation;
  isAuthenticated: boolean;
  payload?: AuthPayload;
  error: unknown | null;
}

const initialState: AuthState = {
  token: "",
  payload: {
    email: "",
    password: "",
  },
  isAuthenticated: false,
  userInfo: {
    id: 0,
    email: "",
    fullName: "",
    role: "",
  },
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
  initialState: initialState,
  reducers: {
    loginRequest: (state, action: PayloadAction<AuthPayload>) => {
      state.payload = action.payload;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      const {
        payload: { token },
      } = action.payload;
      localStorage.setItem("token", token);
      state.userInfo = getUserInformation(token);
      state.isAuthenticated = true;
      state.token = token;
      state.error = null;
    },
    loginFailed: (state, action: PayloadAction<unknown>) => {
      handleError(action.payload);
      state.error = action.payload;
    },
    logoutRequest: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailed, logoutRequest } =
  authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
