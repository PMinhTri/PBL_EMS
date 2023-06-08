import {
  LeaveBalance,
  LeaveRequest,
  LeaveRequestPayload,
  LeaveStatus,
  LeaveType,
} from "../types/leaveTypes";
import { $get, $patch, $post } from "../utils/http";

export const getAllLeaveType = async () => {
  const response: {
    statusCode: number;
    payload: LeaveType[];
  } = await $get("/leave/leave-types");

  return response;
};

export const createLeaveRequest = async (payload: LeaveRequestPayload) => {
  console.log(payload);

  const response: {
    statusCode: number;
    payload: LeaveRequest;
  } = await $post("/leave/create", payload);

  return response;
};

export const getLeaveRequestsByUser = async (userId: string) => {
  const response: {
    statusCode: number;
    payload: LeaveRequest[];
  } = await $get(`/leave/user/?userId=${userId}`);

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

  console.log(
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

export const cancelLeaveRequest = async (id: string) => {
  const response: {
    statusCode: number;
    payload: LeaveRequest;
  } = await $patch(`/leave/cancel/${id}`, {
    status: LeaveStatus.Cancelled,
  });

  return response;
};

export const getAllLeaveRequest = async (month: number, year: number) => {
  const response: {
    statusCode: number;
    payload: LeaveRequest[];
  } = await $get(`/leave/?month=${month}&year=${year}`);

  return response;
};

export const getRemainingBalance = async (year: number) => {
  const response: {
    statusCode: number;
    payload: LeaveBalance[];
  } = await $get(`/leave/remaining-balance/all/?year=${year}`);

  return response;
};
