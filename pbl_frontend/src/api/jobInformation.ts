import dayjs from "dayjs";
import { JobInformation } from "../types/jobInformationTypes";

import { $get, $patch, $post } from "../utils/http";

export const getJobInformationByUserId = async (userId: string) => {
  const response: {
    statusCode: number;
    payload: JobInformation;
  } = await $get(`/job-information/user?userId=${userId}`);

  return response;
};

export const getAllJobInformation = async () => {
  const response: {
    statusCode: number;
    payload: JobInformation[];
  } = await $get("/job-information");

  return response;
};

export const createJobInformation = async (payload: {
  userId: string;
  joinDate: string;
  employeeStatus: string;
}) => {
  const response: {
    statusCode: number;
    payload: JobInformation;
  } = await $post("/job-information/create", {
    userId: payload.userId,
    joinDate: dayjs(payload.joinDate).format("YYYY-MM-DD"),
    employeeStatus: payload.employeeStatus,
  });

  return response;
};

export const updateJobInformation = async (
  id: string,
  payload: JobInformation
) => {
  const response: {
    statusCode: number;
    payload: JobInformation;
  } = await $patch(`/job-information/${id}`, {
    joinDate: dayjs(payload.joinDate).format("YYYY-MM-DD"),
    employeeStatus: payload.employeeStatus,
    jobTitleId: payload.jobTitleId,
    other: payload.other,
    workingSkill: payload.workingSkill?.map((skill) => skill.id),
    departmentId: payload.departmentId,
  });

  return response;
};

export const updateContract = async (
  id: string,
  payload: {
    contractTypeId: string;
    contractStartDate: Date;
    contractEndDate: Date;
  }
) => {
  const response: {
    statusCode: number;
    payload: JobInformation;
  } = await $patch(`/job-information/${id}/contract`, {
    contractTypeId: payload.contractTypeId,
    contractStartDate: dayjs(payload.contractStartDate).format("YYYY-MM-DD"),
    contractEndDate: dayjs(payload.contractEndDate).format("YYYY-MM-DD"),
  });

  return response;
};
