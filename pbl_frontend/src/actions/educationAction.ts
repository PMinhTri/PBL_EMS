import { createEducation, getAllEducation } from "../api/education";
import { handleError } from "../utils/errorHandler";

export const EducationAction = {
  getAllEducation: async () => {
    const response = await getAllEducation();

    return response.payload;
  },

  create: async (grade: string) => {
    const response = await createEducation(grade);

    if (response.statusCode === 200) {
      const { payload } = response;
      return payload;
    }

    handleError(response);
  },
};
