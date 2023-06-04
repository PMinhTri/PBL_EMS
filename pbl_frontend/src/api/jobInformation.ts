import { JobInformation } from "../types/jobInformationTypes";

import { $get } from "../utils/http";

export const getJobInformationByUserId = async (userId: string) => {
  const response: {
    statusCode: number;
    payload: JobInformation;
  } = await $get(`/job-information/user?${userId}`);

  return response;
};

export const getAllJobInformation = async () => {
  const response: {
    statusCode: number;
    payload: JobInformation[];
  } = await $get("/job-information");

  return response;
};
