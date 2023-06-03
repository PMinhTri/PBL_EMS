import { getAllJobTitles } from "../api/jobTitle";
import { JobTitle } from "../types/jobTitleTypes";

export const JobTitleAction = {
  getAllJobTitles: async (): Promise<JobTitle[]> => {
    const jobTitles = await getAllJobTitles();

    const { payload } = jobTitles;

    return payload;
  },
};
