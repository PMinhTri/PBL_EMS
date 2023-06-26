import {
  LeaveBalance,
  LeaveRequest,
  LeaveRequestPayload,
  LeaveStatus,
  LeaveType,
} from "../types/leaveTypes";
import { $delete, $get, $patch, $post } from "../utils/http";

export const getAllLeaveType = async () => {
  const response: {
    statusCode: number;
    payload: LeaveType[];
  } = await $get("/leave/leave-types");

  return response;
};

export const createLeaveType = async (name: string, balance: number) => {
  const response: {
    statusCode: number;
    payload: LeaveType;
  } = await $post("/leave/leave-types/create", { name, balance });

  return response;
};

export const createLeaveRequest = async (payload: LeaveRequestPayload) => {
  const response: {
    statusCode: number;
    payload: LeaveRequest;
  } = await $post("/leave/create", payload);

  return response;
};

export const updateLeaveRequest = async (
  id: string,
  payload: LeaveRequestPayload
) => {
  const response: {
    statusCode: number;
    payload: LeaveRequest;
  } = await $patch(`/leave/update/${id}`, payload);

  return response;
};

export const getLeaveRequestsByUser = async (
  userId: string,
  month: number,
  year: number
) => {
  const response: {
    statusCode: number;
    payload: LeaveRequest[];
  } = await $get(`/leave/user/?userId=${userId}&month=${month}&year=${year}`);

  return response;
};

export const getRemainingBalanceByUser = async (
  userId: string,
  leaveTypeId: string,
  year: number
) => {
  const response: {
    statusCode: number;
    payload: number;
  } = await $get(
    `/leave/remaining-balance/?userId=${userId}&leaveTypeId=${leaveTypeId}&year=${year}`
  );

  return response;
};

export const getByUserId = async (userId: string) => {
  const response: {
    statusCode: number;
    payload: LeaveRequest[];
  } = await $get(`/leave/user/?userId=${userId}`);

  return response;
};

export const approveLeaveRequest = async (id: string) => {
  const response: {
    statusCode: number;
    payload: LeaveRequest;
  } = await $patch(`/leave/approve/${id}`, {
    status: LeaveStatus.Approved,
  });

  return response;
};

export const cancelLeaveRequest = async (id: string) => {
  const response: {
    statusCode: number;
    payload: LeaveRequest;
  } = await $patch(`/leave/cancel/${id}`, {
    status: LeaveStatus.Cancelled,
  });

  return response;
};

export const rejectLeaveRequest = async (id: string) => {
  const response: {
    statusCode: number;
    payload: LeaveRequest;
  } = await $patch(`/leave/reject/${id}`, {
    status: LeaveStatus.Rejected,
  });

  return response;
};

export const deleteLeaveRequest = async (id: string) => {
  const response: {
    statusCode: number;
    payload: LeaveRequest;
  } = await $delete(`/leave/remove/${id}`);

  return response;
};

export const getAllLeaveRequest = async (
  month: number,
  year: number,
  filterQuery?: string
) => {
  const response: {
    statusCode: number;
    payload: LeaveRequest[];
  } = await $get(`/leave/?month=${month}&year=${year}&${filterQuery}`);

  return response;
};

export const getRemainingBalance = async (year: number) => {
  const response: {
    statusCode: number;
    payload: LeaveBalance[];
  } = await $get(`/leave/remaining-balance/all/?year=${year}`);

  return response;
};
