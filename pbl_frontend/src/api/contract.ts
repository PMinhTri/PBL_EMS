import { Contract } from "../types/contractTypes";

import { $get } from "../utils/http";

export const getAllContracts = async () => {
  const response: {
    statusCode: number;
    payload: Contract[];
  } = await $get(`/contract`);
  return response;
};
