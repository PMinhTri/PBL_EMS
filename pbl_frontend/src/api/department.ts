import { Department } from "../types/departmentTypes";

import { $get, $post } from "../utils/http";

export const getAllDepartments = async () => {
  const response: {
    statusCode: number;
    payload: Department[];
  } = await $get(`/department`);
  return response;
};

export const createDepartment = async (name: string) => {
  const response: {
    statusCode: number;
    payload: Department;
  } = await $post(`/department/create`, { name });

  return response;
};
