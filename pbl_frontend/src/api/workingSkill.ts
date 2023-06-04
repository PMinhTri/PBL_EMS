import { WorkingSkill } from "../types/workingSkillTypes";

import { $get } from "../utils/http";

export const getAllWorkingSkills = async () => {
  const response: {
    statusCode: number;
    payload: WorkingSkill[];
  } = await $get(`/working-skill`);
  return response;
};
