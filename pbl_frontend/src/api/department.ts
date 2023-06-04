import { Department } from "../types/departmentTypes";

import { $get } from "../utils/http";

export const getAllDepartments = async () => {
  const response: {
    statusCode: number;
    payload: Department[];
  } = await $get(`/department`);
  return response;
};
