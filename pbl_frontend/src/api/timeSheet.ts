import { TimeSheet, TimeSheetPayload } from "../types/timeSheet";
import { $get, $post } from "../utils/http";

export const createTimeSheet = async (timeSheet: TimeSheetPayload) => {
  console.log(timeSheet);
  const response: {
    statusCode: number;
    payload: TimeSheet;
  } = await $post("/time-sheet/create", timeSheet);

  return response;
};

export const getTimeSheetOfUser = async (
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
