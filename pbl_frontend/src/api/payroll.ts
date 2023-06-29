import { Payroll, PayrollPayload } from "../types/payrollTypes";
import { $get, $patch, $post } from "../utils/http";

export const calculatePayroll = async (payload: Omit<Payroll, "id">) => {
  const response: {
    statusCode: number;
    payload: Payroll;
  } = await $post("/payroll", payload);

  return response;
};

export const calculatePayrollForAllUser = async (payload: PayrollPayload[]) => {
  const response: {
    statusCode: number;
    payload: Payroll[];
  } = await $post(`/payroll/all`, payload);

  return response;
};

export const updatedPayroll = async (
  id: string,
  payload: Partial<Omit<PayrollPayload, "userId">>
) => {
  const response: {
    statusCode: number;
    payload: Payroll;
  } = await $patch(`/payroll/${id}`, payload);

  return response;
};

export const getAllPayroll = async (month: number, year: number) => {
  const response: {
    statusCode: number;
    payload: Payroll[];
  } = await $get(`/payroll/?month=${month}&year=${year}`);

  return response;
};

export const getAllPayrollOfUser = async (
  userId: string,
  month: number,
  year: number
) => {
  const response: {
    statusCode: number;
    payload: Payroll[];
  } = await $get(`/payroll/user/?userId=${userId}&month=${month}&year=${year}`);

  return response;
};
