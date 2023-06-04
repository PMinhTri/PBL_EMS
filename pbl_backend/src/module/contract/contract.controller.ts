import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ContractService } from './contract.service';
import { BadRequestResult, IResponse, SuccessResult } from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post('/create')
  public async createContract(
    @Body() payload: { type: string },
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: contract,
      status,
      failure,
    } = await this.contractService.createContract(payload.type);

    if (status === ServiceResponseStatus.Failed) {
      return res.send(
        BadRequestResult({
          reason: failure.reason,
          message: 'Contract already exists',
        }),
      );
    }

    return res.send(SuccessResult(contract));
  }

  @Get('')
  public async getAllContracts(@Res() res: IResponse): Promise<IResponse> {
    const { result: contracts } = await this.contractService.getAllContracts();

    return res.send(SuccessResult(contracts));
  }
}
