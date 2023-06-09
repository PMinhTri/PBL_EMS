import {
  approveLeaveRequest,
  cancelLeaveRequest,
  createLeaveRequest,
  createLeaveType,
  deleteLeaveRequest,
  getAllLeaveRequest,
  getAllLeaveType,
  getLeaveRequestsByUser,
  getRemainingBalance,
  getRemainingBalanceByUser,
  rejectLeaveRequest,
  updateLeaveRequest,
} from "../api/leave";
import { LeaveRequestPayload, LeaveType } from "../types/leaveTypes";
import { handleError } from "../utils/errorHandler";
import showNotification from "../utils/notification";

export const LeaveAction = {
  getAllLeaveType: async (): Promise<LeaveType[]> => {
    const response = await getAllLeaveType();

    return response.payload;
  },

  createLeaveType: async (name: string, balance: number) => {
    const response = await createLeaveType(name, balance);

    if (response.statusCode === 200) {
      return response.payload;
    }

    handleError(response);
  },

  createLeaveRequest: async (payload: LeaveRequestPayload) => {
    const response = await createLeaveRequest(payload);

    if (response.statusCode === 200) {
      showNotification("success", "Tạo yêu cầu thành công!");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return response.payload;
    }

    handleError(response);
  },

  updateLeaveRequest: async (id: string, payload: LeaveRequestPayload) => {
    const response = await updateLeaveRequest(id, payload);

    if (response.statusCode === 200) {
      return response.payload;
    }

    handleError(response);
  },

  getRemainingBalanceByUser: async (
    userId: string,
    leaveTypeId: string,
    year: number
  ): Promise<number> => {
    const response = await getRemainingBalanceByUser(userId, leaveTypeId, year);

    return response.payload;
  },

  getAllLeaveRequestByUserId: async (
    userId: string,
    month: number,
    year: number
  ) => {
    const response = await getLeaveRequestsByUser(userId, month, year);

    if (response.statusCode === 200) {
      return response.payload;
    }

    handleError(response);
  },

  approve: async (id: string) => {
    const response = await approveLeaveRequest(id);

    if (response.statusCode === 200) {
      showNotification("success", "Đã duyệt yêu cầu!");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return response.payload;
    }

    handleError(response);
  },

  cancel: async (id: string) => {
    const response = await cancelLeaveRequest(id);

    if (response.statusCode === 200) {
      return response.payload;
    }

    handleError(response);
  },

  reject: async (id: string) => {
    const response = await rejectLeaveRequest(id);

    if (response.statusCode === 200) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return response.payload;
    }

    handleError(response);
  },

  delete: async (id: string) => {
    const response = await deleteLeaveRequest(id);

    if (response.statusCode === 200) {
      return response.payload;
    }

    handleError(response);
  },

  getAllLeaveRequest: async (
    month: number,
    year: number,
    filter?: string[]
  ) => {
    const filterQuery = filter?.length
      ? `status=${filter.join("&status=")}`
      : "";

    const response = await getAllLeaveRequest(month, year, filterQuery);

    return response.payload;
  },

  getAllRemainingBalance: async (year: number) => {
    const response = await getRemainingBalance(year);

    return response.payload;
  },
};
