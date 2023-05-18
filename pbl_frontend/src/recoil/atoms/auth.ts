import { atom } from "recoil";
import { AuthState } from "../../types/authTypes";

export const authState = atom<AuthState>({
  key: "authState",
  default: {
    token: "",
    isAuthenticated: false,
  },
});
