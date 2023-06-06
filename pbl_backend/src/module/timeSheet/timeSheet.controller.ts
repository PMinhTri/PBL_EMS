import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { TimeSheetService } from './timeSheet.service';
import { BadRequestResult, IResponse, SuccessResult } from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';
import { TimeSheetDto } from './timeSheet.dto';

@Controller('time-sheet')
export class TimeSheetController {
  constructor(private readonly timeSheetService: TimeSheetService) {}

  @Post('create')
  public async createTimeSheet(
    @Body() dto: TimeSheetDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result, status, failure } =
      await this.timeSheetService.createTimeSheet(dto);

    if (status === ServiceResponseStatus.Failed) {
      return res.send(
        BadRequestResult({
          reason: failure.reason,
          message: 'Bạn đã thực hiện chấm công cho ca làm việc này!',
        }),
      );
    }

    return res.send(SuccessResult(result));
  }

  @Get('')
  public async getAllTimeSheetByUserIdAndMonth(
    @Query('userId') userId: string,
    @Query('month') month: number,
    @Query('year') year: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result, status } =
      await this.timeSheetService.getAllTimeSheetByUserIdAndMonth(
        userId,
        Number(month),
        Number(year),
      );

    if (status === ServiceResponseStatus.Failed) {
      return res.send(
        BadRequestResult({
          message: 'Không tìm thấy thông tin chấm công!',
        }),
      );
    }

    return res.send(SuccessResult(result));
  }

  @Get('workload')
  public async getWorkloadByUserIdAndMonth(
    @Query('userId') userId: string,
    @Query('month') month: number,
    @Query('year') year: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result, status } = await this.timeSheetService.totalWorkloadOfUser(
      userId,
      Number(month),
      Number(year),
    );

    if (status === ServiceResponseStatus.Failed) {
      return res.send(
        BadRequestResult({
          message: 'Không tìm thấy thông tin chấm công!',
        }),
      );
    }

    return res.send(SuccessResult(result));
  }

  @Delete('delete')
  public async deleteTimeSheet(
    @Query('userId') userId: string,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { status } = await this.timeSheetService.deleteAllTimeSheetByUserId(
      userId,
    );

    return res.send(SuccessResult());
  }
}
