import { getAllEducation } from "../api/education";

export const EducationAction = {
  getAllEducation: async () => {
    const response = await getAllEducation();

    return response.payload;
  },
};
