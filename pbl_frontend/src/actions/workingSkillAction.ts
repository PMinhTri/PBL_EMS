import { getAllWorkingSkills } from "../api/workingSkill";

import { WorkingSkill } from "../types/workingSkillTypes";

export const WorkingSkillAction = {
  getAllWorkingSkills: async (): Promise<WorkingSkill[]> => {
    const workingSkills = await getAllWorkingSkills();

    const { payload } = workingSkills;

    return payload;
  },
};
