import { selector } from "recoil";
import { jobInformationState } from "../atoms/jobInformation";

export const jobInformationSelector = selector({
  key: "jobInformationSelector",

  get: ({ get }) => {
    const jobInformation = get(jobInformationState);
    return {
      jobInformation,
    };
  },
});
