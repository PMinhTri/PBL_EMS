import { createContract, getAllContracts } from "../api/contract";
import { Contract } from "../types/contractTypes";
import { handleError } from "../utils/errorHandler";

export const ContractAction = {
  getAllContracts: async (): Promise<Contract[]> => {
    const contracts = await getAllContracts();

    const { payload } = contracts;

    return payload;
  },

  create: async (type: string) => {
    const response = await createContract(type);

    if (response.statusCode === 200) {
      return response.payload;
    }

    handleError(response);
  },
};
