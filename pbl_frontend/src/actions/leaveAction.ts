import {
  approveLeaveRequest,
  cancelLeaveRequest,
  createLeaveRequest,
  getAllLeaveRequest,
  getAllLeaveType,
  getLeaveRequestsByUser,
  getRemainingBalance,
  getRemainingBalanceByUser,
  rejectLeaveRequest,
} from "../api/leave";
import { LeaveRequestPayload, LeaveType } from "../types/leaveTypes";
import { handleError } from "../utils/errorHandler";

export const LeaveAction = {
  getAllLeaveType: async (): Promise<LeaveType[]> => {
    const response = await getAllLeaveType();

    return response.payload;
  },

  createLeaveRequest: async (payload: LeaveRequestPayload) => {
    const response = await createLeaveRequest(payload);

    if (response.statusCode === 200) {
      return response.payload;
    }

    handleError(response);
  },

  getLeaveRequestsByUser: async (userId: string) => {
    const response = await getLeaveRequestsByUser(userId);

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

  getAllLeaveRequestByUserId: async (userId: string) => {
    const response = await getLeaveRequestsByUser(userId);

    if (response.statusCode === 200) {
      return response.payload;
    }

    handleError(response);
  },

  approve: async (id: string) => {
    const response = await approveLeaveRequest(id);

    if (response.statusCode === 200) {
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
      return response.payload;
    }

    handleError(response);
  },

  getAllLeaveRequest: async (month: number, year: number) => {
    const response = await getAllLeaveRequest(month, year);

    return response.payload;
  },

  getAllRemainingBalance: async (year: number) => {
    const response = await getRemainingBalance(year);

    return response.payload;
  },
};
