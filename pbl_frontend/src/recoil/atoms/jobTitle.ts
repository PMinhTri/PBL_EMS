import { atom } from "recoil";
import { JobTitle } from "../../types/jobTitleTypes";

export const jobTitleState = atom<JobTitle[]>({
  key: "jobTitleState",
  default: [],
});
