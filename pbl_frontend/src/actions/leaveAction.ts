import {
  cancelLeaveRequest,
  createLeaveRequest,
  getAllLeaveType,
  getLeaveRequestsByUser,
  getRemainingBalance,
} from "../api/leave";
import { LeaveRequest, LeaveRequestPayload, LeaveType } from "../types/leave";
import { handleError } from "../utils/errorHandler";

export const LeaveAction = {
  getLeaveType: async (): Promise<LeaveType[]> => {
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

  getRemainingBalance: async (
    userId: string,
    leaveTypeId: string
  ): Promise<number> => {
    const response = await getRemainingBalance(userId, leaveTypeId);

    return response.payload;
  },

  getAllLeaveRequestByUserId: async (userId: string) => {
    const response = await getLeaveRequestsByUser(userId);

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
};
