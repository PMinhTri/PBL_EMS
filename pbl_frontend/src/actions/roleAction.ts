import { getAllRoles } from "../api/role";
import { Role } from "../types/roleTypes";

export const RoleAction = {
  getAllRoles: async (): Promise<Role[]> => {
    const roles = await getAllRoles();

    const { payload } = roles;

    return payload;
  },
};
