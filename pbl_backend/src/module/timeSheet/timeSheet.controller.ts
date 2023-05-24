import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { TimeSheetService } from './timeSheet.service';
import { BadRequestResult, IResponse, SuccessResult } from 'src/httpResponse';
import { ServiceResponseStatus } from 'src/serviceResponse';
import { TimeSheetDto } from './timeSheet.dto';
import { TimeSheetFailure } from 'src/enumTypes/failure.enum';

@Controller('time-sheet')
export class TimeSheetController {
  constructor(private readonly timeSheetService: TimeSheetService) {}

  @Post('check-in')
  public async checkIn(
    @Body() dto: TimeSheetDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: timeSheet,
      failure,
      status,
    } = await this.timeSheetService.checkIn(dto);

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case TimeSheetFailure.TIME_SHEET_ALREADY_EXISTS:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Time sheet already exists',
            }),
          );
      }
    }

    return res.send(
      SuccessResult({
        timeSheet,
      }),
    );
  }

  @Get('/user')
  public async getMonthlyTimeSheet(
    @Query('userId') userId: number,
    @Query('month') month: number,
    @Query('year') year: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: timeSheets,
      failure,
      status,
    } = await this.timeSheetService.getMonthlyTimeSheet(
      Number(userId),
      Number(month),
      Number(year),
    );

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case TimeSheetFailure.TIME_SHEET_NOT_FOUND:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Time sheet not found',
            }),
          );
      }
    }

    return res.send(
      SuccessResult({
        timeSheets,
      }),
    );
  }

  @Get('/total-hours')
  public async getTotalHoursWorkedInMonth(
    @Query('userId') userId: number,
    @Query('month') month: number,
    @Query('year') year: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: totalHoursWorked,
      failure,
      status,
    } = await this.timeSheetService.totalTimeWorkedInMonth(
      Number(userId),
      Number(month),
      Number(year),
    );

    if (status === ServiceResponseStatus.Failed) {
      switch (failure.reason) {
        case TimeSheetFailure.TIME_SHEET_NOT_FOUND:
          return res.send(
            BadRequestResult({
              reason: failure.reason,
              message: 'Time sheet not found',
            }),
          );
      }
    }

    return res.send(
      SuccessResult({
        totalHoursWorked,
      }),
    );
  }
}
