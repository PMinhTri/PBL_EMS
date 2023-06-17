import { Education } from "../types/eductionTypes";
import { $get, $post } from "../utils/http";

export const getAllEducation = async () => {
  const response: {
    statusCode: number;
    payload: Education[];
  } = await $get("/education");

  return response;
};

export const createEducation = async (grade: string) => {
  const response: {
    statusCode: number;
    payload: Education;
  } = await $post("/education", { grade });

  return response;
};
