import { JobInformation } from "../types/jobInformationTypes";
import {
  createJobInformation,
  getAllJobInformation,
  getJobInformationByUserId,
  updateJobInformation,
} from "../api/jobInformation";
import { handleError } from "../utils/errorHandler";

export const JobInformationAction = {
  getByUserId: async (userId: string) => {
    const response: {
      statusCode: number;
      payload: JobInformation;
    } = await getJobInformationByUserId(userId);

    return response.payload;
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

  create: async (payload: {
    userId: string;
    joinDate: string;
    employeeStatus: string;
  }) => {
    const response = await createJobInformation(payload);

    return response.payload;
  },

  update: async (id: string, payload: JobInformation) => {
    const response = await updateJobInformation(id, payload);

    if (response.statusCode === 200) {
      const { payload } = response;
      return payload;
    }

    handleError(response);
  },
};
