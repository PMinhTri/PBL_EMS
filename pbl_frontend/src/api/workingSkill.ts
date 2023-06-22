import { WorkingSkill } from "../types/workingSkillTypes";

import { $get, $post } from "../utils/http";

export const getAllWorkingSkills = async () => {
  const response: {
    statusCode: number;
    payload: WorkingSkill[];
  } = await $get(`/working-skill`);
  return response;
};

export const createWorkingSkill = async (payload: {
  name: string;
  description?: string;
}) => {
  const response: {
    statusCode: number;
    payload: WorkingSkill;
  } = await $post(`/working-skill/create`, payload);
  return response;
};
