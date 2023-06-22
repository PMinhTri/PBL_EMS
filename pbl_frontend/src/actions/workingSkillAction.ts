import { createWorkingSkill, getAllWorkingSkills } from "../api/workingSkill";

import { WorkingSkill } from "../types/workingSkillTypes";
import { handleError } from "../utils/errorHandler";

export const WorkingSkillAction = {
  getAllWorkingSkills: async (): Promise<WorkingSkill[]> => {
    const workingSkills = await getAllWorkingSkills();

    const { payload } = workingSkills;

    return payload;
  },

  create: async (payload: { name: string; description?: string }) => {
    const response = await createWorkingSkill(payload);

    if (response.statusCode === 200) {
      return response.payload;
    }

    handleError(response);
  },
};
