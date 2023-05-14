import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthPayload, AuthResponse } from "../../../types/authTypes";

export interface AuthState {
  token: string | null;
  payload?: AuthPayload;
  isLoading: boolean;
  isAuthenticated: boolean;
  logging: boolean;
  error: unknown | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  payload: {
    email: "",
    password: "",
  },
  isLoading: false,
  isAuthenticated: false,
  logging: false,
  error: null,
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
      console.log(action.payload);
      const {
        payload: { token },
      } = action.payload;
      localStorage.setItem("token", token);
      state.token = token;
      state.isLoading = false;
      state.error = null;
    },
    loginFailed: (state, action: PayloadAction<unknown>) => {
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
