import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto } from './education.dto';
import {
  BadRequestResult,
  IResponse,
  NotFoundResult,
  SuccessResult,
} from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post('')
  public async createEducation(
    @Body() createEducationDto: CreateEducationDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result, status, failure } =
      await this.educationService.createEducation(createEducationDto);

    if (status === ServiceResponseStatus.Failed) {
      return res.send(
        BadRequestResult({
          reason: failure.reason,
          message: 'education already exists',
        }),
      );
    }

    return res.send(SuccessResult(result));
  }

  @Get('')
  public async getEducation(@Res() res: IResponse): Promise<IResponse> {
    const education = await this.educationService.getEducation();

    return res.send(SuccessResult(education));
  }

  @Get('/:id')
  public async getEducationById(
    @Param('id') id: string,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result, status, failure } =
      await this.educationService.getEducationById(id);

    if (status === ServiceResponseStatus.Failed) {
      return res.send(
        NotFoundResult({
          reason: failure.reason,
          message: 'education not found',
        }),
      );
    }

    return res.send(SuccessResult(result));
  }

  @Delete('/:id')
  public async deleteEducationById(
    @Param('id') id: string,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { status, failure } = await this.educationService.deleteEducation(id);

    if (status === ServiceResponseStatus.Failed) {
      return res.send(
        NotFoundResult({
          reason: failure.reason,
          message: 'education not found',
        }),
      );
    }

    return res.send(SuccessResult('education deleted successfully'));
  }
}
