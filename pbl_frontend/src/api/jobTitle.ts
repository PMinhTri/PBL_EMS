import { JobTitle } from "../types/jobTitleTypes";
import { $get } from "../utils/http";

export const getAllJobTitles = async () => {
  const response: {
    statusCode: number;
    payload: JobTitle[];
  } = await $get(`/job-title`);
  return response;
};
