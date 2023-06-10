import { Education } from "../types/eductionTypes";
import { $get } from "../utils/http";

export const getAllEducation = async () => {
  const response: {
    statusCode: number;
    payload: Education[];
  } = await $get("/education");

  return response;
};
