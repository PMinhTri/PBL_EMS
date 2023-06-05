import { selector } from "recoil";
import { jobTitleState } from "../atoms/jobTitle";

const jobTitleSelector = selector({
  key: "jobTitleSelector",
  get: ({ get }) => {
    const jobTitles = get(jobTitleState);
    return {
      jobTitles,
    };
  },
});

export default jobTitleSelector;
