import { selector } from "recoil";
import { userAuthState, userInfoState } from "../atoms/user";

const userSelector = selector({
  key: "userSelector",
  get: ({ get }) => {
    const userAuthInfo = get(userAuthState);
    const userInfo = get(userInfoState);
    return {
      userAuthInfo,
      userInfo,
    };
  },
});

export default userSelector;
