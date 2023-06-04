import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { WorkingSkillService } from './workingSkill.service';
import { IResponse, NotFoundResult, SuccessResult } from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';
import { WorkingSkillDto } from './workingSkill.dto';

@Controller('working-skill')
export class WorkingSkillController {
  constructor(private readonly workingSkillService: WorkingSkillService) {}

  @Get('')
  public async getAllWorkingSkill(@Res() res: IResponse): Promise<IResponse> {
    const workingSkill = await this.workingSkillService.getAllWorkingSkill();

    return res.send(SuccessResult(workingSkill));
  }

  @Get('/:id')
  public async getWorkingSkillById(
    @Res() res: IResponse,
    @Param('id') id: string,
  ): Promise<IResponse> {
    const { result, status, failure } =
      await this.workingSkillService.getWorkingSkillById(id);

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case 'WORKING_SKILL_NOT_FOUND':
          return res.send(
            NotFoundResult({
              reason: failure.reason,
              message: 'Working Skill not found',
            }),
          );
      }
    }

    return res.send(SuccessResult(result));
  }

  @Post('/create')
  public async createWorkingSkill(
    @Body() dto: WorkingSkillDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result } = await this.workingSkillService.createWorkingSkill(dto);

    return res.send(SuccessResult(result));
  }

  @Delete('/:id')
  public async deleteWorkingSkill(
    @Res() res: IResponse,
    @Param('id') id: string,
  ): Promise<IResponse> {
    const { result, status, failure } =
      await this.workingSkillService.deleteWorkingSkill(id);

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case 'WORKING_SKILL_NOT_FOUND':
          return res.send(
            NotFoundResult({
              reason: failure.reason,
              message: 'Working Skill not found',
            }),
          );
      }
    }

    return res.send(SuccessResult(result));
  }
}
