import { atom } from "recoil";
import { Department } from "../../types/departmentTypes";

export const departmentState = atom<Department[]>({
  key: "departmentState",
  default: [],
});
