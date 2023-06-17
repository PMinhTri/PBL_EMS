import { createRole, getAllRoles } from "../api/role";
import { Role } from "../types/roleTypes";
import { handleError } from "../utils/errorHandler";

export const RoleAction = {
  getAllRoles: async (): Promise<Role[]> => {
    const roles = await getAllRoles();

    const { payload } = roles;

    return payload;
  },

  create: async (name: string) => {
    const response = await createRole(name);

    if (response.statusCode === 200) {
      const { payload } = response;
      return payload;
    }

    handleError(response);
  },
};
