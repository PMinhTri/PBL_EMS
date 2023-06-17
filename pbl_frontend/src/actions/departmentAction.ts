import { Department } from "../types/departmentTypes";
import { createDepartment, getAllDepartments } from "../api/department";
import { handleError } from "../utils/errorHandler";

export const DepartmentAction = {
  getAllDepartments: async (): Promise<Department[]> => {
    const departments = await getAllDepartments();

    const { payload } = departments;

    return payload;
  },

  create: async (name: string) => {
    const response = await createDepartment(name);

    if (response.statusCode === 200) {
      const { payload } = response;
      return payload;
    }

    handleError(response);
  },
};
