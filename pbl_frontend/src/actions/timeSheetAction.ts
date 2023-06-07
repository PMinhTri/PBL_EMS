import {
  createTimeSheet,
  getAllTimeSheetInMonth,
  getTimeSheetOfUser,
  getTotalWorkload,
} from "../api/timeSheet";
import { TimeSheet, TimeSheetPayload } from "../types/timeSheet";
import { handleError } from "../utils/errorHandler";

export const TimeSheetAction = {
  create: async (timeSheet: TimeSheetPayload) => {
    const response = await createTimeSheet(timeSheet);

    if (response.statusCode === 200) {
      return response.payload;
    }

    handleError(response);
  },

  getByUser: async (userId: string, month: number, year: number) => {
    const response = await getTimeSheetOfUser(userId, month, year);

    return response.payload;
  },

  totalWorkload: async (userId: string, month: number, year: number) => {
    const response = await getTotalWorkload(userId, month, year);

    return response.payload;
  },

  getAllTimeSheetOfUser: async (
    userId: string,
    month: number,
    year: number
  ) => {
    const response = await getTimeSheetOfUser(userId, month, year);

    return response.payload;
  },

  getAllInMonth: async (month: number, year: number) => {
    const response = await getAllTimeSheetInMonth(month, year);

    return response.payload;
  },
};
