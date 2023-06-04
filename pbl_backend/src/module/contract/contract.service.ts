import { Injectable } from '@nestjs/common';
import { Contract } from '@prisma/client';
import { ContractFailure } from 'src/enumTypes/failure.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ServiceFailure,
  ServiceResponse,
  ServiceResponseStatus,
} from 'src/serviceResponse';

@Injectable()
export class ContractService {
  constructor(private prisma: PrismaService) {}

  public async createContract(
    type: string,
  ): Promise<ServiceResponse<Contract, ServiceFailure<ContractFailure>>> {
    const existingContract = await this.prisma.contract.findFirst({
      where: {
        type: type,
      },
    });

    if (existingContract) {
      return {
        status: ServiceResponseStatus.Failed,
        failure: {
          reason: ContractFailure.CONTRACT_ALREADY_EXISTS,
        },
      };
    }

    const contract = await this.prisma.contract.create({
      data: {
        type,
      },
    });

    return {
      status: ServiceResponseStatus.Success,
      result: contract,
    };
  }

  public async getAllContracts(): Promise<
    ServiceResponse<Contract[], ServiceFailure<ContractFailure>>
  > {
    const contract = await this.prisma.contract.findMany();

    return {
      status: ServiceResponseStatus.Success,
      result: contract,
    };
  }
}
