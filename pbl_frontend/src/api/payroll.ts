import { Payroll } from "../types/payrollTypes";
import { $get, $post } from "../utils/http";

export const calculatePayroll = async (payload: Omit<Payroll, "id">) => {
  const response: {
    statusCode: number;
    payload: Payroll;
  } = await $post("/payroll", payload);

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
  } = await $get(
    `/payroll/user/user/?userId=${userId}&month=${month}&year=${year}`
  );

  return response;
};
