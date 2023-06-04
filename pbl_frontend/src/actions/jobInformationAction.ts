import { JobInformation } from "../types/jobInformationTypes";
import { getAllJobInformation, getJobInformationByUserId } from "../api/jobInformation";
import { handleError } from "../utils/errorHandler";

export const JobInformationAction = {
  getByUserId: async (userId: string) => {
    const response: {
      statusCode: number;
      payload: JobInformation;
    } = await getJobInformationByUserId(userId);

    if (response.statusCode === 200) {
      return response.payload;
    }

    handleError(response);
  },

  getAll: async () => {
    const response: {
      statusCode: number;
      payload: JobInformation[];
    } = await getAllJobInformation();

    if (response.statusCode === 200) {
      return response.payload;
    }

    handleError(response);
  },
};
