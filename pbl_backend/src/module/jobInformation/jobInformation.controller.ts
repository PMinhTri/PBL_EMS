import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { JobInformationService } from './jobInformation.service';
import { BadRequestResult, IResponse, SuccessResult } from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';
import { JobInformationFailure } from 'src/enumTypes/failure.enum';
import { JobInformationDto } from './jobInformation.dto';
import { RoleEnum } from 'src/enumTypes/role.enum';
import { Roles } from '../role/role.decorator';

@Controller('/job-information')
export class JobInformationController {
  constructor(private jobInformationService: JobInformationService) {}

  @Post('/create')
  @Roles(RoleEnum.ADMIN)
  public async createJobInformation(
    @Body() dto: Partial<JobInformationDto>,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: jobInformation,
      status,
      failure,
    } = await this.jobInformationService.createJobInformation(dto);

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case JobInformationFailure.JOB_INFORMATION_ALREADY_EXISTS:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: `Job Information already exists`,
            }),
          );
      }
    }

    return res.send(SuccessResult(jobInformation));
  }

  @Get('')
  public async getAllJobInformation(@Res() res: IResponse): Promise<IResponse> {
    const { result: jobInformation } =
      await this.jobInformationService.getAllJobInformation();

    return res.send(SuccessResult(jobInformation));
  }

  @Get('/user')
  public async getJobInformationByUserId(
    @Query('userId') userId: string,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    console.log(userId);
    const {
      result: jobInformation,
      status,
      failure,
    } = await this.jobInformationService.getJobInformationByUserId(
      Number(userId),
    );

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case JobInformationFailure.JOB_INFORMATION_NOT_FOUND:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: `Job Information not found`,
            }),
          );
      }
    }

    return res.send(SuccessResult(jobInformation));
  }

  @Get(':id')
  public async getJobInformationById(
    @Param('id') id: string,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: jobInformation,
      status,
      failure,
    } = await this.jobInformationService.getJobInformationById(Number(id));

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case JobInformationFailure.JOB_INFORMATION_NOT_FOUND:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: `Job Information not found`,
            }),
          );
      }
    }

    return res.send(SuccessResult(jobInformation));
  }

  @Patch(':id')
  public async updateJobInformation(
    @Param('id') id: string,
    @Body() dto: JobInformationDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: jobInformation,
      status,
      failure,
    } = await this.jobInformationService.updateJobInformation(Number(id), dto);

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case JobInformationFailure.JOB_INFORMATION_NOT_FOUND:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: `Job Information not found`,
            }),
          );
      }
    }

    return res.send(SuccessResult(jobInformation));
  }
}
