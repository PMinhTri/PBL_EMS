import { TimeSheet, TimeSheetPayload } from "../types/timeSheet";
import { $get, $patch, $post } from "../utils/http";

export const createTimeSheet = async (timeSheet: TimeSheetPayload) => {
  const response: {
    statusCode: number;
    payload: TimeSheet;
  } = await $post("/time-sheet/create", timeSheet);

  return response;
};

export const getTimeSheetOfUser = async (
  userId: string,
  month: number,
  year: number,
  date?: number
) => {
  const response: {
    statusCode: number;
    payload: TimeSheet[];
  } = await $get(
    `/time-sheet/?userId=${userId}&month=${month}&year=${year}&date=${date}`
  );

  return response;
};

export const updateByDate = async (
  userId: string,
  date: Date,
  timeSheets: TimeSheetPayload[]
) => {
  const response: {
    statusCode: number;
    payload: TimeSheet;
  } = await $patch(`/time-sheet/update-by-date`, {
    userId: userId,
    date: date,
    dto: timeSheets,
  });

  return response;
};

export const getTotalWorkload = async (
  userId: string,
  month: number,
  year: number
) => {
  const response: {
    statusCode: number;
    payload: number;
  } = await $get(
    `/time-sheet/workload/?userId=${userId}&month=${month}&year=${year}`
  );

  return response;
};

export const getAllTimeSheetOfUser = async (
  userId: string,
  month: number,
  year: number
) => {
  const response: {
    statusCode: number;
    payload: TimeSheet[];
  } = await $get(`/time-sheet/?userId=${userId}&month=${month}&year=${year}`);

  return response;
};

export const getAllTimeSheetInMonth = async (month: number, year: number) => {
  const response: {
    statusCode: number;
    payload: TimeSheet[];
  } = await $get(`/time-sheet/all/?month=${month}&year=${year}`);

  return response;
};

export const getOvertimeWorkload = async (
  userId: string,
  month: number,
  year: number
) => {
  const response: {
    statusCode: number;
    payload: number;
  } = await $get(
    `/time-sheet/overtime?userId=${userId}&month=${month}&year=${year}`
  );

  return response;
};

export const getAllOvertimeInMonth = async (month: number, year: number) => {
  const response: {
    statusCode: number;
    payload: TimeSheet[];
  } = await $get(`/time-sheet/overtime/all/?month=${month}&year=${year}`);

  return response;
};

export const getAllTotalWorkloadOfAllUser = async (
  month: number,
  year: number
) => {
  const response: {
    statusCode: number;
    payload: {
      userId: string;
      totalWorkload: number;
    }[];
  } = await $get(`/time-sheet/workload/all?month=${month}&year=${year}`);

  return response;
};

export const getAllTotalOvertimeOfAllUser = async (
  month: number,
  year: number
) => {
  const response: {
    statusCode: number;
    payload: {
      userId: string;
      totalOvertime: number;
    }[];
  } = await $get(`/time-sheet/overtime/all/total/?month=${month}&year=${year}`);

  return response;
};
