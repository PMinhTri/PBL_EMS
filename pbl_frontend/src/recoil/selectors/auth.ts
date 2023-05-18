import { selector } from "recoil";
import { authState } from "../atoms/auth";

const authSelector = selector({
  key: "authSelector",
  get: ({ get }) => {
    const auth = get(authState);
    return {
      auth,
    };
  },
});

export default authSelector;
