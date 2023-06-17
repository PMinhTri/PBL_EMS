import { Contract } from "../types/contractTypes";

import { $get, $post } from "../utils/http";

export const getAllContracts = async () => {
  const response: {
    statusCode: number;
    payload: Contract[];
  } = await $get(`/contract`);
  return response;
};

export const createContract = async (type: string) => {
  const response: {
    statusCode: number;
    payload: Contract;
  } = await $post(`/contract/create`, { type });

  return response;
};
