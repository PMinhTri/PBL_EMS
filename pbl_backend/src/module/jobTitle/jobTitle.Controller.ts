import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { JobTitleService } from './jobTitle.service';
import { BadRequestResult, IResponse, SuccessResult } from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';
import { JobTitleFailure } from 'src/enumTypes/failure.enum';
import { CreateJobTitleDto } from './jobTitle.dto';

@Controller('job-title')
export class JobTitleController {
  constructor(private readonly jobTitleService: JobTitleService) {}

  @Get('')
  async getAllJobTitles(@Res() res: IResponse): Promise<IResponse> {
    const { result } = await this.jobTitleService.getAllJobTitles();
    return res.send(SuccessResult(result));
  }

  @Get(':id')
  public async getById(
    @Param('id') id: string,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: jobTitle,
      status,
      failure,
    } = await this.jobTitleService.getJobTitleById(Number(id));

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case JobTitleFailure.JOB_TITLE_NOT_FOUND:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: `Job Title not found`,
            }),
          );
      }
    }

    return res.send(SuccessResult(jobTitle));
  }

  @Post('/create')
  public async createJobTitle(
    @Body() dto: CreateJobTitleDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: jobTitle,
      status,
      failure,
    } = await this.jobTitleService.createJobTitle(dto);

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case JobTitleFailure.JOB_TITLE_ALREADY_EXISTS:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: `Job Title already exists`,
            }),
          );
      }
    }

    return res.send(SuccessResult(jobTitle));
  }

  @Delete(':id')
  public async deleteJobTitle(
    @Param('id') id: string,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: jobTitle,
      status,
      failure,
    } = await this.jobTitleService.deleteJobTitle(Number(id));

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case JobTitleFailure.JOB_TITLE_NOT_FOUND:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: `Job Title not found`,
            }),
          );
      }
    }

    return res.send(SuccessResult(jobTitle));
  }
}
