import {
  LeaveRequest,
  LeaveRequestPayload,
  LeaveStatus,
  LeaveType,
} from "../types/leave";
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

export const getRemainingBalance = async (
  userId: string,
  leaveTypeId: string
) => {
  const response: {
    statusCode: number;
    payload: number;
  } = await $get(`/leave/remaining-balance/${leaveTypeId}?userId=${userId}`);

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
