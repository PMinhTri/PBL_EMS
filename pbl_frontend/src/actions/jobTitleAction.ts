import { createJobTitle, getAllJobTitles } from "../api/jobTitle";
import { JobTitle } from "../types/jobTitleTypes";
import { handleError } from "../utils/errorHandler";

export const JobTitleAction = {
  getAllJobTitles: async (): Promise<JobTitle[]> => {
    const jobTitles = await getAllJobTitles();

    const { payload } = jobTitles;

    return payload;
  },

  create: async (name: string) => {
    const response = await createJobTitle(name);

    if (response.statusCode === 200) {
      const { payload } = response;
      return payload;
    }

    handleError(response);
  },
};
