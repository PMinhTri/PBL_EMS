import { atom } from "recoil";
import { UserAuthInfo, UserDetailInformation } from "../../types/userTypes";

export const userAuthState = atom<UserAuthInfo>({
  key: "userState",
  default: {
    id: 0,
    email: "",
    fullName: "",
    role: "",
  },
});

export const userInfoState = atom<UserDetailInformation>({
  key: "userInfoState",
  default: {
    id: 0,
    email: "",
    fullName: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: new Date(),
    phoneNumber: "",
    address: "",
    city: "",
    nationality: "",
    avatar: "",
    citizenId: "",
    status: "",
    role: {
      name: "",
    },
  },
});
