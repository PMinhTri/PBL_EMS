import { UserInformation } from "../types/userTypes";

const getUserInformation = (token: string): UserInformation => {
  const base64Url = token?.split(".")[1];

  const decodeTokenData = base64Url ? JSON.parse(window.atob(base64Url)) : "";

  return decodeTokenData;
};

export const UserAction = {
  getUserInformation,
};
