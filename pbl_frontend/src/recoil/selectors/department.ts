import { selector } from "recoil";
import { departmentState } from "../atoms/department";

const departmentSelector = selector({
  key: "departmentSelector",
  get: ({ get }) => {
    const departments = get(departmentState);
    return {
      departments,
    };
  },
});

export default departmentSelector;
