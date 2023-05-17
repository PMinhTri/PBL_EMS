import { atom } from "recoil";
import { UserInformation } from "../types/userTypes";

export const userState = atom<UserInformation>({
  key: "userState",
  default: {
    id: 0,
    email: "",
    fullName: "",
    role: "",
  },
});
