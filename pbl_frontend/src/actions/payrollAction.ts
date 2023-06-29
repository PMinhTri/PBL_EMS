import {
  calculatePayroll,
  calculatePayrollForAllUser,
  getAllPayroll,
  getAllPayrollOfUser,
  updatedPayroll,
} from "../api/payroll";
import { Payroll, PayrollPayload } from "../types/payrollTypes";
import { handleError } from "../utils/errorHandler";
import showNotification from "../utils/notification";

export const PayrollAction = {
  calculate: async (payload: Omit<Payroll, "id">) => {
    const response = await calculatePayroll(payload);

    if (response.statusCode === 200) {
      return response.payload;
    }

    handleError(response);
  },

  calculatePayrollForAllUser: async (payload: PayrollPayload[]) => {
    const response = await calculatePayrollForAllUser(payload);

    if (response.statusCode === 200) {
      showNotification("success", "Tạo bảng lương thành công");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return response.payload;
    }

    handleError(response);
  },

  updatedPayroll: async (
    id: string,
    payload: Partial<Omit<PayrollPayload, "userId">>
  ) => {
    console.log(id);
    const response = await updatedPayroll(id, payload);

    if (response.statusCode === 200) {
      console.log(response.payload);
      showNotification("success", "Cập nhật bảng lương thành công");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return response.payload;
    }

    handleError(response);
  },

  getAllPayload: async (month: number, year: number) => {
    const response = await getAllPayroll(month, year);

    if (response.statusCode === 200) {
      return response.payload;
    }

    handleError(response);
  },

  getAllPayloadOfUser: async (userId: string, month: number, year: number) => {
    const response = await getAllPayrollOfUser(userId, month, year);

    if (response.statusCode === 200) {
      return response.payload;
    }

    handleError(response);
  },
};
