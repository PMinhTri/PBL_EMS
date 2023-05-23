import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { IResponse, SuccessResult } from 'src/httpResponse';
import { LeaveDto } from './leave.dto';

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Get('/leave-types')
  public async getLeaveTypes(@Res() res: IResponse): Promise<IResponse> {
    const leaveTypes = await this.leaveService.getAllLeaveTypes();

    return res.send(SuccessResult(leaveTypes));
  }

  @Post('/leave-types/create')
  public async createLeaveType(
    @Body() payload: { name: string; balance: number },
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const { result: leaveTypes } = await this.leaveService.createLeaveType(
      payload.name,
      payload.balance,
    );

    return res.send(SuccessResult(leaveTypes));
  }

  @Post('/create')
  public async createLeave(
    @Body() payload: LeaveDto,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: leaveRequest,
      status,
      failure,
    } = await this.leaveService.createLeave(payload);

    if (status === 'Failed') {
      switch (failure.reason) {
        case 'LEAVE_BALANCE_EXCEEDED':
          return res.send({
            status: failure.reason,
            message: 'Leave balance exceeded',
          });
      }
    }

    return res.send(SuccessResult(leaveRequest));
  }

  @Get('/remaining-balance')
  public async getRemainingBalance(
    @Query('userId') userId: number,
    @Res() res: IResponse,
  ): Promise<IResponse> {
    const {
      result: remainingLeaveDays,
      status,
      failure,
    } = await this.leaveService.getRemainingBalance(Number(userId));

    if (status === 'Failed') {
      switch (failure.reason) {
        case 'LEAVE_TYPE_NOT_FOUND':
          return res.send({
            status: failure.reason,
            message: 'Leave type not found',
          });
      }
    }

    return res.send(SuccessResult(remainingLeaveDays));
  }
}
