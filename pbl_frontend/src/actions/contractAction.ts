import { getAllContracts } from "../api/contract";
import { Contract } from "../types/contractTypes";

export const ContractAction = {
  getAllContracts: async (): Promise<Contract[]> => {
    const contracts = await getAllContracts();

    const { payload } = contracts;

    return payload;
  },
};
