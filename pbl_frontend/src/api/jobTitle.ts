import { JobTitle } from "../types/jobTitleTypes";
import { $get, $post } from "../utils/http";

export const getAllJobTitles = async () => {
  const response: {
    statusCode: number;
    payload: JobTitle[];
  } = await $get(`/job-title`);
  return response;
};

export const createJobTitle = async (name: string) => {
  const response: {
    statusCode: number;
    payload: JobTitle;
  } = await $post(`/job-title/create`, { name });

  return response;
};
