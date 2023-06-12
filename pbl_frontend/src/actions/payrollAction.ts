import {
  calculatePayroll,
  getAllPayroll,
  getAllPayrollOfUser,
} from "../api/payroll";
import { Payroll } from "../types/payrollTypes";

export const PayrollAction = {
  calculate: async (payload: Omit<Payroll, "id">) => {
    const response = await calculatePayroll(payload);

    if (response.statusCode === 200) {
      return response.payload;
    }

    return response.payload;
  },

  getAllPayload: async (month: number, year: number) => {
    const response = await getAllPayroll(month, year);

    if (response.statusCode === 200) {
      return response.payload;
    }

    return response.payload;
  },

  getAllPayloadOfUser: async (userId: string, month: number, year: number) => {
    const response = await getAllPayrollOfUser(userId, month, year);

    if (response.statusCode === 200) {
      return response.payload;
    }

    return response.payload;
  },
};
