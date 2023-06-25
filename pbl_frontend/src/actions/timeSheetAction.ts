import {
  createTimeSheet,
  getAllOvertimeInMonth,
  getAllTimeSheetInMonth,
  getOvertimeWorkload,
  getTimeSheetOfUser,
  getTotalWorkload,
} from "../api/timeSheet";
import { TimeSheetPayload } from "../types/timeSheet";
import { handleError } from "../utils/errorHandler";
import showNotification from "../utils/notification";

export const TimeSheetAction = {
  create: async (timeSheet: TimeSheetPayload) => {
    const response = await createTimeSheet(timeSheet);

    if (response.statusCode === 200) {
      showNotification("success", "Đã thực hiện chấm công!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return response.payload;
    }

    handleError(response);

    return;
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

  getOvertimeWorkLoad: async (userId: string, month: number, year: number) => {
    const response = await getOvertimeWorkload(userId, month, year);

    return response.payload;
  },

  getAllOvertimeWorkload: async (month: number, year: number) => {
    const response = await getAllOvertimeInMonth(month, year);

    return response.payload;
  },
};
