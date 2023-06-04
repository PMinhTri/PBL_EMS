import { Department } from "../types/departmentTypes";
import { getAllDepartments } from "../api/department";

export const DepartmentAction = {
  getAllDepartments: async (): Promise<Department[]> => {
    const departments = await getAllDepartments();

    const { payload } = departments;

    return payload;
  },
};
