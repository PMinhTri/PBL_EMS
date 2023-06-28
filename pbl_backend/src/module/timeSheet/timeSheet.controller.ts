import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { TimeSheetService } from './timeSheet.service';
import { BadRequestResult, IResponse, SuccessResult } from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';
import { TimeSheetDto } from './timeSheet.dto';
import { TimeSheetFailure } from 'src/enumTypes/failure.enum';
import { TimeSheet } from '@prisma/client';

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
      switch (failure.reason) {
        case TimeSheetFailure.REQUEST_ON_LEAVE_DATE:
          return res.send(
            BadRequestResult({
              message: 'Không thể chấm công trong ngày nghỉ!',
            }),
          );
        case TimeSheetFailure.TIME_SHEET_ALREADY_EXISTS:
          return res.send(
            BadRequestResult({
              message: 'Đã thực hiện chấm công!',
            }),
          );
      }
    }

    return res.send(SuccessResult(result));
  }

  @Get('')
  public async getAllTimeSheetByUserIdAndMonth(
    @Query('userId') userId: string,
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('date') date: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result, status, failure } =
      await this.timeSheetService.getAllTimeSheetByUserIdAndMonth(
        userId,
        Number(month),
        Number(year),
        Number(date),
      );

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case TimeSheetFailure.TIME_SHEET_NOT_FOUND:
          return res.send(
            BadRequestResult({
              message: 'Không tìm thấy thông tin chấm công!',
            }),
          );
      }
    }

    return res.send(SuccessResult(result));
  }

  @Patch('update-by-date')
  public async updateTimeSheet(
    @Body()
    payload: {
      userId: string;
      date: Date;
      dto: TimeSheet[];
    },
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result, status, failure } =
      await this.timeSheetService.updateTimeSheetByDate(
        payload.userId,
        payload.date,
        payload.dto,
      );

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case TimeSheetFailure.TIME_SHEET_NOT_FOUND:
          return res.send(
            BadRequestResult({
              message: 'Không tìm thấy thông tin chấm công!',
            }),
          );
      }
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
    const { result, status, failure } =
      await this.timeSheetService.totalWorkloadOfUser(
        userId,
        Number(month),
        Number(year),
      );

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case TimeSheetFailure.TIME_SHEET_NOT_FOUND:
          return res.send(
            BadRequestResult({
              message: 'Không tìm thấy thông tin chấm công!',
            }),
          );
      }
    }

    return res.send(SuccessResult(result));
  }

  @Get('workload/all')
  public async getAllWorkloadInMonth(
    @Query('month') month: number,
    @Query('year') year: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result, status } =
      await this.timeSheetService.getAllTotalWorkloadOfAllUser(
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

  @Get('overtime')
  public async getOvertimeByUserIdAndMonth(
    @Query('userId') userId: string,
    @Query('month') month: number,
    @Query('year') year: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result, status, failure } =
      await this.timeSheetService.totalOvertimeOfUser(
        userId,
        Number(month),
        Number(year),
      );

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case TimeSheetFailure.TIME_SHEET_NOT_FOUND:
          return res.send(
            BadRequestResult({
              message: 'Không tìm thấy thông tin chấm công!',
            }),
          );
      }
    }

    return res.send(SuccessResult(result));
  }

  @Get('overtime/all/total')
  public async getAllTotalOvertimeOfAllUser(
    @Query('month') month: number,
    @Query('year') year: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result, status } =
      await this.timeSheetService.getAllTotalOvertimeOfAllUser(
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

  @Get('overtime/all')
  public async getAllOvertimeInMonth(
    @Query('month') month: number,
    @Query('year') year: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result, status } =
      await this.timeSheetService.getAllOverTimeInMonth(
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
    const { status, failure } =
      await this.timeSheetService.deleteAllTimeSheetByUserId(userId);

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case TimeSheetFailure.TIME_SHEET_NOT_FOUND:
          return res.send(
            BadRequestResult({
              message: 'Không tìm thấy thông tin chấm công!',
            }),
          );
      }
    }

    return res.send(SuccessResult());
  }

  @Get('all')
  public async getAllTimeSheetOfUser(
    @Query('month') month: number,
    @Query('year') year: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result, status } =
      await this.timeSheetService.getAllTimeSheetInMonth(
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
}
